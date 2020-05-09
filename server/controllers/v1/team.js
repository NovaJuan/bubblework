const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const Team = require('../../models/Team');

// @route     GET /api/v1/bubbles/:bubble/teams
// @desc      Get all teams from a bubble
// @access    Private
exports.getAll = asyncHandler(async (req, res, next) => {
	const teams = await Team.find({ bubble: req.params.bubble });

	res.status(200).json({
		success: true,
		data: teams,
	});
});

// @route     POST /api/v1/bubbles/:bubble/teams
// @desc      Create a team in a bubble
// @access    Private
exports.create = asyncHandler(async (req, res, next) => {
	let team = await Team.findOne({
		name: req.body.name,
		bubble: req.params.bubble,
	});

	if (team) {
		return next(
			new ErrorResponse(
				`A team called "${req.body.name}" already exists in this bubble.`,
				400
			)
		);
	}

	team = await Team.create({
		name: req.body.name,
		bubble: req.params.bubble,
	});

	res.status(201).json({
		success: true,
		data: team,
	});
});

// @route     GET /api/v1/bubbles/:bubble/teams/:team
// @desc      Get a specific team from a bubble
// @access    Private
exports.getOne = asyncHandler(async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: req.f_team,
	});
});

// @route     PUT /api/v1/bubbles/:bubble/teams/:team
// @desc      Update a specific team of a bubble
// @access    Private
exports.update = asyncHandler(async (req, res, next) => {
	let team = await Team.findByIdAndUpdate(
		req.params.team,
		{
			name: req.body.name,
		},
		{ runValidators: true, new: true }
	);

	res.status(200).json({
		success: true,
		data: team,
	});
});

// @route     DELETE /api/v1/bubbles/:bubble/teams/:team
// @desc      Delete a team from a bubble
// @access    Private
exports.remove = asyncHandler(async (req, res, next) => {
	await req.f_team.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
