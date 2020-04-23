const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Member = require('../models/Member');
const Bubble = require('../models/Bubble');

module.exports = asyncHandler(async (req, res, next) => {
	// Check if bubble exists
	const bubble = await Bubble.findById(req.params.bubble);

	if (!bubble) {
		return next(new ErrorResponse('Bubble not found.', 404));
	}

	// If user is admin, then grant access
	if (req.user.role === 'admin') {
		return next();
	}

	// Check if member is leader and is allowed to add members
	const member = await Member.findOne({
		user: req.user._id,
		bubble: req.params.bubble,
	});

	if (!member || member.role !== 'leader') {
		return next(new ErrorResponse('Not allowed to access this bubble.', 401));
	}

	req.bubble = bubble;
	req.member = member;

	next();
});
