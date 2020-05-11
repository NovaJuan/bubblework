const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const formattedObject = require('../../utils/formattedObject');
const stripe = require('../../services/stripe');

// @route     POST /api/v1/auth/payment-methods
// @desc      Create a new payment method to the user
// @access    Private
exports.create = asyncHandler(async (req, res, next) => {
	const user = req.user;

	const paymentMethod = await stripe.paymentMethods.create({
		card: req.body,
		user,
		isDefault: req.body.default || false,
	});

	res.status(200).json({
		success: true,
		data: paymentMethod,
	});
});

// @route     GET /api/v1/auth/payment-methods
// @desc      Get the user's payment methods
// @access    Private
exports.getAll = asyncHandler(async (req, res, next) => {
	const user = req.user;

	const pms = await stripe.paymentMethods.list(user.stripe_customerid);

	res.status(200).json({
		success: true,
		data: pms,
	});
});

// @route     PUT /api/v1/auth/payment-methods/:pm
// @desc      Update a specific payment method
// @access    Private
exports.update = asyncHandler(async (req, res, next) => {
	const user = req.user;

	let pm = await stripe.paymentMethods.retrieve(req.params.pm);

	if (pm.customer !== user.stripe_customerid) {
		return next(
			new ErrorResponse('You cannot update this payment method', 403)
		);
	}

	const fields = formattedObject({
		holder: req.body.holder,
		exp_month: req.body.exp_month,
		exp_year: req.body.exp_year,
	});

	pm = await stripe.paymentMethods.update(
		req.params.pm,
		fields,
		req.body.default,
		user.stripe_customerid
	);

	res.status(200).json({
		success: true,
		data: pm,
	});
});

// @route     DELETE /api/v1/auth/payment-methods/:pm
// @desc      Remove a specific payment method
// @access    Private
exports.remove = asyncHandler(async (req, res, next) => {
	const user = req.user;

	const pm = await stripe.paymentMethods.retrieve(req.params.pm);

	if (pm.customer !== user.stripe_customerid) {
		return next(
			new ErrorResponse('You cannot remove this payment method', 403)
		);
	}

	const defaultPm = await stripe.customers.getDefaultPaymentMethod(
		user.stripe_customerid
	);

	if (defaultPm.id === pm.id) {
		return next(
			new ErrorResponse('You cannot remove your default payment method', 403)
		);
	}

	await stripe.paymentMethods.remove(req.params.pm);

	res.status(200).json({
		success: true,
		data: {},
	});
});
