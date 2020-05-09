const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Plan = require('../models/Plan');

module.exports = asyncHandler(async (req, res, next) => {
	// Check if bubble exists
	const plan = await Plan.findById(req.params.plan);

	if (!plan) {
		return next(new ErrorResponse('Plan not found.', 404));
	}

	req.f_plan = plan;
	next();
});
