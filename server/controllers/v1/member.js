const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const Member = require('../../models/Member');
const User = require('../../models/User');

// @route     GET /api/v1/bubbles/:bubble/members
// @desc      Get all members from a bubble
// @access    Private
exports.getAll = asyncHandler(async (req, res, next) => {
	// Check if the user that will be added exists
	let members = await Member.find({ bubble: req.params.bubble }).populate(
		'user'
	);

	res.status(200).json({
		success: true,
		data: members,
	});
});

// @route     POST /api/v1/bubbles/:bubble/members
// @desc      Add a new member to a bubble
// @access    Private
exports.add = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.body.user);

	if (!user) {
		return next(new ErrorResponse("That user doesn't exists.", 404));
	}

	// Create new member
	const member = await Member.create({
		user: req.body.user,
		bubble: req.params.bubble,
		role: req.body.role,
	});

	res.status(201).json({
		success: true,
		data: member,
	});
});

// @route     GET /api/v1/bubbles/:bubble/members/:member
// @desc      Get a specific member from a bubble
// @access    Private
exports.getOne = asyncHandler(async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: req.f_member,
	});
});

// @route     PUT /api/v1/bubbles/:bubble/members/:member
// @desc      Update a member from a bubble
// @access    Private
exports.update = asyncHandler(async (req, res, next) => {
	const member = await Member.findByIdAndUpdate(
		req.params.member,
		{ role: req.body.role },
		{ runValidators: true, new: true }
	);

	res.status(200).json({
		success: true,
		data: member,
	});
});

// @route     DELETE /api/v1/bubbles/:bubble/members/:member
// @desc      Remove a member from a bubble
// @access    Private
exports.remove = asyncHandler(async (req, res, next) => {
	if (req.f_member.user._id.equals(req.user._id)) {
		return next(new ErrorResponse('Cannot remove yourself.', 401));
	}

	if (
		!req.user._id.equals(req.f_bubble.creator) &&
		req.f_member.role === 'leader' &&
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
