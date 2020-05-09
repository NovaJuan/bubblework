const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const formattedObject = require('../../utils/formattedObject');
const Bubble = require('../../models/Bubble');
const Member = require('../../models/Member');
const Plan = require('../../models/Plan');
const stripe = require('../../services/stripe');

// @route     GET /api/v1/bubbles
// @desc      Get all bubbles from database
// @access    Public
exports.getAll = asyncHandler(async (req, res, next) => {
	const bubbles = await Bubble.find(req.params.bubble)
		.populate('creator')
		.populate('plan');

	res.status(200).json({
		success: true,
		data: bubbles,
	});
});

// @route     GET /api/v1/bubbles/:bubble
// @desc      Get a single bubble
// @access   Public
exports.getOne = asyncHandler(async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: req.f_bubble,
	});
});

// @route     POST /api/v1/bubbles
// @desc      Create a bubble
// @access    Private
exports.create = asyncHandler(async (req, res, next) => {
	const { card } = req.body;
	const plan = await Plan.findById(req.query.plan);

	if (!plan) {
		return next(new ErrorResponse("That plan doesn't exists.", 404));
	}

	const fields = formattedObject({
		name: req.body.name,
		description: req.body.description,
		plan: plan._id,
		creator: req.user._id,
	});

	const bubble = await Bubble.create(fields);

	let subscription;
	try {
		subscription = await stripe.subscriptions.create({
			card,
			user: req.user,
			plan,
			bubble,
		});
	} catch (err) {
		await bubble.remove();

		return next(err);
	}

	bubble.set({
		status: subscription.status,
		stripe_subid: subscription.id,
		last_payment: Date.now(),
	});

	await bubble.save();

	// Create the first leader of the bubble
	await Member.create({
		user: req.user._id,
		bubble: bubble._id,
		role: 'creator',
	});

	res.status(201).json({
		success: true,
		data: bubble,
	});
});

// @route     PUT /api/v1/bubbles/:bubble
// @desc      Update a bubble
// @access    Private/Admin
exports.update = asyncHandler(async (req, res, next) => {
	const fields = formattedObject({
		name: req.body.name,
		description: req.body.description,
	});

	bubble = await Bubble.findByIdAndUpdate(req.params.bubble, fields, {
		runValidators: true,
		new: true,
	});

	res.status(200).json({
		success: true,
		data: bubble,
	});
});

// @route     DELETE /api/v1/bubbles/:bubble
// @desc      Delete a bubble
// @access    Private/Admin
exports.remove = asyncHandler(async (req, res, next) => {
	await stripe.subscriptions.remove(req.f_bubble.stripe_subid);

	const bubble = await Bubble.findByIdAndRemove(req.params.bubble);

	await bubble.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
