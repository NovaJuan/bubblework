const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

module.exports = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.user);

	if (!user) {
		return next(new ErrorResponse('User not found.', 404));
	}

	req.f_user = user;
	next();
});
