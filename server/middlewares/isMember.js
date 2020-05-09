const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Member = require('../models/Member');

module.exports = asyncHandler(async (req, res, next) => {
	// If user is admin, then grant access
	if (req.user.role === 'admin') {
		return next();
	}

	// Check if member is leader and is allowed to add members
	const member = await Member.findOne({
		user: req.user._id,
		bubble: req.f_bubble._id,
	});

	if (!member) {
		return next(new ErrorResponse('Not allowed to access this bubble.', 401));
	}

	req.member = member;

	next();
});
