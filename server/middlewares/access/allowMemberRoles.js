const ErrorResponse = require('../../utils/ErrorResponse');
const asyncHandler = require('../../utils/asyncHandler');

module.exports = (...args) =>
	asyncHandler(async (req, res, next) => {
		if (req.user.role !== 'admin' && !args.includes(req.member.role)) {
			return next(new ErrorResponse('Not allowed to access this route', 401));
		}

		next();
	});
