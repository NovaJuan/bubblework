const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const Team = require('../../models/Team');
const Task = require('../../models/Task');

// @route     GET /api/v1/bubbles/:bubble/teams/:team/tasks
// @desc      Get all task of a team
// @access    Private
exports.getAll = asyncHandler(async (req, res, next) => {
	const teams = await Task.find({ team: req.params.team })
		.populate('created_by')
		.populate('team');

	res.status(200).json({
		success: true,
		data: teams,
	});
});

// @route     GET /api/v1/bubbles/:bubble/teams/:team/tasks/:task
// @desc      Get single task of a team
// @access    Private
exports.getOne = asyncHandler(async (req, res, next) => {
	const task = await Task.findById(req.params.task)
		.populate('created_by')
		.populate('team');

	if (!task) {
		return next(
			new ErrorResponse("That task doesn't exists in this team.", 404)
		);
	}

	res.status(200).json({
		success: true,
		data: task,
	});
});

// @route     POST /api/v1/bubbles/:bubble/teams/:team/tasks
// @desc      Create a task
// @access    Private
exports.create = asyncHandler(async (req, res, next) => {
	const task = await Task.create({
		...req.body,
		bubble: req.f_bubble._id,
		created_by: req.user._id,
		team: req.params.team,
	});

	res.status(200).json({
		success: true,
		data: task,
	});
});

// @route     PUT /api/v1/bubbles/:bubble/teams/:team/tasks/:task
// @desc      Update a single task of a team
// @access    Private
exports.update = asyncHandler(async (req, res, next) => {
	const task = await Task.findByIdAndUpdate(req.params.task, req.body, {
		runValidators: true,
		new: true,
	});

	res.status(200).json({
		success: true,
		data: task,
	});
});

// @route     DELETE /api/v1/bubbles/:bubble/teams/:team/tasks/:task
// @desc      Delete a single task of a team
// @access    Private
exports.remove = asyncHandler(async (req, res, next) => {
	await Task.findByIdAndRemove(req.params.task);

	res.status(200).json({
		success: true,
		data: {},
	});
});
