const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Bubble = require('../models/Bubble');

module.exports = asyncHandler(async (req, res, next) => {
	const bubble = await Bubble.findById(req.params.bubble)
		.populate('creator')
		.populate('plan');

	if (!bubble) {
		return next(new ErrorResponse('Bubble not found.', 404));
	}

	req.f_bubble = bubble;
	next();
});
