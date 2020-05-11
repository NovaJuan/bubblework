const ErrorResponse = require('../../utils/ErrorResponse');
const asyncHandler = require('../../utils/asyncHandler');
const Team = require('../../models/Team');

module.exports = asyncHandler(async (req, res, next) => {
	// Check if bubble exists
	const team = await Team.findById(req.params.team);

	if (!team) {
		return next(new ErrorResponse('Team not found.', 404));
	}

	req.f_team = team;
	next();
});
