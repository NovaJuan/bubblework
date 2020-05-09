const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

module.exports = (...args) =>
	asyncHandler(async (req, res, next) => {
		if (!args.includes(req.user.role) && req.user.role !== 'admin') {
			return next(new ErrorResponse('Not allowed to access this route', 401));
		}

		next();
	});
