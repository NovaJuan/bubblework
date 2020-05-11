const ErrorResponse = require('../../utils/ErrorResponse');
const asyncHandler = require('../../utils/asyncHandler');
const Bubble = require('../../models/Bubble');

module.exports = asyncHandler(async (req, res, next) => {
	const bubble = req.f_bubble;

	if (bubble.status !== 'active' && bubble.status !== 'trialing') {
		return next(
			new ErrorResponse(
				`Your bubble is currently deactivated, there is a problem with the payment. Status: ${bubble.status}`,
				402
			)
		);
	}

	next();
});
