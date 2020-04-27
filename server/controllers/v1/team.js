const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const Team = require('../../models/Team');

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

exports.getAll = asyncHandler(async (req, res, next) => {
	const teams = await Team.find({ bubble: req.params.bubble });

	res.status(200).json({
		success: true,
		data: teams,
	});
});

exports.getOne = asyncHandler(async (req, res, next) => {
	let team = await Team.findById(req.params.team);

	if (!team) {
		return next(
			new ErrorResponse(`That team doesn\'t exists in this bubble.`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: team,
	});
});

exports.update = asyncHandler(async (req, res, next) => {
	let team = await Team.findById(req.params.team);

	if (!team) {
		return next(
			new ErrorResponse(`That team doesn\'t exists in this bubble.`, 404)
		);
	}

	team = await Team.findByIdAndUpdate(
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

exports.remove = asyncHandler(async (req, res, next) => {
	let team = await Team.findById(req.params.team);

	if (!team) {
		return next(
			new ErrorResponse(`That team doesn\'t exists in this bubble.`, 404)
		);
	}

	team = await Team.findByIdAndDelete(req.params.team);

	res.status(200).json({
		success: true,
		data: {},
	});
});
