const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
	if (!req.user) {
		return next(new ErrorResponse('Not allowed to access this route', 401));
	}

	next();
});
