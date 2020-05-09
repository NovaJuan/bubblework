const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Task = require('../models/Task');

module.exports = asyncHandler(async (req, res, next) => {
	// Check if bubble exists
	const task = await Task.findById(req.params.task);

	if (!task) {
		return next(new ErrorResponse('Task not found.', 404));
	}

	req.f_task = task;
	next();
});
