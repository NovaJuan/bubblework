const asyncHandler = require('../../utils/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const User = require('../../models/User');

// @route     GET /api/v1/users
// @desc      Get all users from database
// @access    Public
exports.getAll = asyncHandler(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		success: true,
		data: users,
	});
});

// @route     GET /api/v1/users/:user
// @desc      Get one user from database
// @access    Public
exports.getOne = asyncHandler(async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: req.f_user,
	});
});

// @route     POST /api/v1/users
// @desc      Create a single user
// @access    Admin
exports.create = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @route     PUT /api/v1/users/:user
// @desc      Update a single user
// @access    Admin
exports.update = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.user, req.body, {
		runValidators: true,
		new: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @route     DELETE /api/v1/users/:user
// @desc      Remove a single user
// @access    Admin
exports.remove = asyncHandler(async (req, res, next) => {
	await req.f_user.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
