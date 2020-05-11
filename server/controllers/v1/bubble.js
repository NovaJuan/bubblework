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
	const user = req.user;
	const plan = await Plan.findById(req.body.plan);

	if (!plan) {
		return next(new ErrorResponse("That plan doesn't exists.", 404));
	}

	const fields = formattedObject({
		name: req.body.name,
		description: req.body.description,
		plan: plan._id,
		creator: user._id,
	});

	const bubble = await Bubble.create(fields);

	if (user.role === 'admin') {
		bubble.set({
			status: 'admin',
			stripe_subid: 'admin',
			last_payment: Date.now(),
		});

		await bubble.save();

		// Create the first leader of the bubble
		await Member.create({
			user: req.user._id,
			bubble: bubble._id,
			role: 'creator',
		});
	} else {
		let subscription;
		try {
			// Checking if user has payment method
			const pms = await stripe.paymentMethods.list(user.stripe_customerid);
			if (pms.length <= 0) {
				throw new ErrorResponse(
					`You don't have any payment method registered, have to create one.`,
					400
				);
			}

			// Creating subscription
			subscription = await stripe.subscriptions.create({
				customerid: user.stripe_customerid,
				plan,
				bubble,
				pm: req.body.payment_method,
			});

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
		} catch (err) {
			await bubble.remove();

			if (subscription) {
				await stripe.subscriptions.remove(subscription.id);
			}

			return next(err);
		}
	}

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

// @route     PUT /api/v1/bubbles/:bubble/change-plan
// @desc      Change bubble's plan
// @access    Private
exports.changePlan = asyncHandler(async (req, res, next) => {
	const newPlan = await Plan.findById(req.body.newPlan);
	let bubble = req.f_bubble;

	if (!newPlan) {
		return next(new ErrorResponse("That plan doesn't exists.", 404));
	}

	if (bubble.plan._id.equals(newPlan._id)) {
		return next(new ErrorResponse('That plan is already selected', 400));
	}

	await stripe.subscriptions.changePlan(bubble.stripe_subid, newPlan.stripe_id);

	bubble = await Bubble.findByIdAndUpdate(
		req.params.bubble,
		{ plan: newPlan._id },
		{ runValidators: true, new: true }
	).populate('plan');

	res.status(200).json({
		success: true,
		data: bubble,
	});
});

// @route     PUT /api/v1/bubbles/:bubble/change-payment-method
// @desc      Change bubble's payment method
// @access    Private
exports.changePaymentMethod = asyncHandler(async (req, res, next) => {
	let bubble = req.f_bubble;

	const sub = await stripe.subscriptions.changePaymentMethod(
		bubble.stripe_subid,
		req.body.payment_method
	);

	res.status(200).json({
		success: true,
		data: sub,
	});
});
