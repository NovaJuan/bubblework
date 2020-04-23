const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const Bubble = require('../../models/Bubble');
const Member = require('../../models/Member');
const User = require('../../models/User');

exports.add = asyncHandler(async (req, res, next) => {
	// Check if the user that will be added exists
	const user = await User.findById(req.body.user);

	if (!user) {
		return next(new ErrorResponse("That user doesn't exists.", 404));
	}

	// Create new member
	await Member.create({
		user: req.body.user,
		bubble: req.params.bubble,
		role: req.body.role,
	});

	res.status(201).json({
		success: true,
		data: {},
	});
});

exports.getAll = asyncHandler(async (req, res, next) => {
	// Check if the user that will be added exists
	let members;

	// If admin is querying all members id DB (without bubble id parameter)
	if (req.user.role === 'admin' && !req.params.bubble) {
		members = await Member.find().populate('user').populate('bubble');
	} else {
		members = await Member.find({ bubble: req.params.bubble }).populate('user');
	}

	res.status(200).json({
		success: true,
		data: members,
	});
});

exports.remove = asyncHandler(async (req, res, next) => {
	if (req.member.role !== 'leader' && req.user.role !== 'admin') {
		return next(new ErrorResponse('Not allowed to access this route', 401));
	}
	// Check if the user that will be added exists
	const member = await Member.findById(req.params.member);

	if (!member) {
		return next(
			new ErrorResponse("That member doesn't exists in this bubble.", 404)
		);
	}

	if (member.user.equals(req.user._id)) {
		return next(new ErrorResponse('Cannot remove yourself.', 401));
	}

	if (
		!req.user._id.equals(req.bubble.creator) &&
		member.role === 'leader' &&
		req.user.role !== 'admin'
	) {
		return next(new ErrorResponse('Only creator can remove leaders.', 401));
	}

	await Member.findByIdAndDelete(req.params.member);

	res.status(200).json({
		success: true,
		data: {},
	});
});
