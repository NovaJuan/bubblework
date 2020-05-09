const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Member = require('../models/Member');

module.exports = asyncHandler(async (req, res, next) => {
	// Check if bubble exists
	const member = await Member.findById(req.params.member).populate('user');

	if (!member) {
		return next(new ErrorResponse('Member not found.', 404));
	}

	req.f_member = member;
	next();
});
