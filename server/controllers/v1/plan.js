const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const stripe = require('../../services/stripe');
const Plan = require('../../models/Plan');
const formattedObject = require('../../utils/formattedObject');

// @route     GET /api/v1/plans
// @desc      Get all plans
// @access    public
exports.getAll = asyncHandler(async (req, res, next) => {
	const plans = await Plan.find();

	res.status(200).json({
		success: true,
		data: plans,
	});
});

// @route     GET /api/v1/plans/:plan
// @desc      Get a specific plan
// @access    public
exports.getOne = asyncHandler(async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: req.f_plan,
	});
});

// @route     POST /api/v1/plans
// @desc      Create a plan
// @access    Private/Admin
exports.create = asyncHandler(async (req, res, next) => {
	const fields = formattedObject({
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		features: req.body.features,
		total_members: req.body.total_members,
	});

	const plan = await Plan.create(fields);

	try {
		const stripe_plan = await stripe.plans.create(fields);

		plan.set({
			stripe_id: stripe_plan.id,
		});

		await plan.save();
	} catch (err) {
		await plan.remove();

		return next(err);
	}

	res.status(201).json({
		success: true,
		data: plan,
	});
});

// @route     PUT /api/v1/plans/:plan
// @desc      Update a plan
// @access    Private/Admin
exports.update = asyncHandler(async (req, res, next) => {
	const plan = req.f_plan;

	const fields = formattedObject({
		name: req.body.name,
		description: req.body.description,
		features: req.body.features,
		total_members: req.body.total_members,
		active: req.body.active,
	});

	plan.set(fields);
	await plan.validate();

	await stripe.plans.update(req.f_plan.stripe_id, fields);

	await plan.save();

	res.status(200).json({
		success: true,
		data: plan,
	});
});

// @route     PUT /api/v1/plans/:plan
// @desc      Update a plan
// @access    Private/Admin
exports.remove = asyncHandler(async (req, res, next) => {
	await stripe.plans.delete(req.f_plan.stripe_id);
	await req.f_plan.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
