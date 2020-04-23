const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const Bubble = require('../../models/Bubble');
const Member = require('../../models/Member');

exports.create = asyncHandler(async (req, res, next) => {
	const bubble = await Bubble.create({ ...req.body, creator: req.user._id });

	// Create the first leader of the bubble
	await Member.create({
		user: req.user._id,
		bubble: bubble._id,
		role: 'leader',
	});

	res.status(201).json({
		success: true,
		data: bubble,
	});
});

exports.getOne = asyncHandler(async (req, res, next) => {
	const bubble = await Bubble.findById(req.params.bubble).populate('creator');

	if (!bubble) {
		return next(new ErrorResponse('Bubble not found.', 404));
	}

	res.status(200).json({
		success: true,
		data: bubble,
	});
});
