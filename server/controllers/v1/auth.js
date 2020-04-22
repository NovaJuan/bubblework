const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const User = require('../../models/User');

exports.register = asyncHandler(async (req, res, next) => {
	if (req.body.role) delete req.body.role;

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

	user = await User.create(req.body);

	res.status(201).json({
		success: true,
		token: user.getAuthToken(),
	});
});

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

	res.status(201).json({
		success: true,
		token: user.getAuthToken(),
	});
});
