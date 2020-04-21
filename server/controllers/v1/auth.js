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
			new ErrorResponse('That username or email already exists.', 400)
		);
	}

	user = await User.create(req.body);

	res.status(201).json({
		success: true,
		token: user.getAuthToken(),
	});
});
