const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
	if (req.member.role !== 'leader' && req.user.role !== 'admin') {
		return next(new ErrorResponse('Not allowed to access this bubble.', 401));
	}
	next();
});
