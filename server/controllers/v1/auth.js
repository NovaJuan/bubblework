const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const formattedObject = require('../../utils/formattedObject');
const User = require('../../models/User');
const stripe = require('../../services/stripe');

// @route     POST /api/v1/auth/register
// @desc      Register user
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
	let user = await User.findOne({
		$or: [{ email: req.body.email }, { username: req.body.username }],
	});

	if (user) {
		return next(
			new ErrorResponse('That username or email is already in use.', 400)
		);
	}

	if (req.body.password !== req.body.password2) {
		return next(new ErrorResponse("Passwords doesn't match.", 400));
	}

	const fields = formattedObject({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	});

	user = await User.create(fields);

	try {
		const customer = await stripe.customers.create({ user });

		user.set({ stripe_customerid: customer.id });
		await user.save();

		res.status(201).json({
			success: true,
			token: user.getAuthToken(),
		});
	} catch (err) {
		await user.remove();
		return next(err);
	}
});

// @route     POST /api/v1/auth/login
// @desc      Login user
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
	if (!req.body.email || !req.body.password) {
		return next(new ErrorResponse('Missing fields.', 400));
	}

	let user = await User.findOne({
		$or: [{ email: req.body.email }, { username: req.body.email }],
	}).select('+password');

	if (!user) {
		return next(new ErrorResponse('Invalid Credentials.', 400));
	}

	if (!(await user.verifyPassword(req.body.password))) {
		return next(new ErrorResponse('Invalid Credentials.', 400));
	}

	res.status(200).json({
		success: true,
		token: user.getAuthToken(),
	});
});

// @route     GET /api/v1/auth
// @desc      Get user logged info
// @access    Private
exports.info = asyncHandler(async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: req.user,
	});
});

// @route     PUT /api/v1/auth
// @desc      Update user info
// @access    Private
exports.update = asyncHandler(async (req, res, next) => {
	const fields = formattedObject({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	});

	req.user = await User.findByIdAndUpdate(req.user._id, fields, {
		runValidators: true,
		new: true,
	});

	res.status(201).json({
		success: true,
		data: req.user,
	});
});
