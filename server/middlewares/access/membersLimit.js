const ErrorResponse = require('../../utils/ErrorResponse');
const asyncHandler = require('../../utils/asyncHandler');
const Plan = require('../../models/Plan');
const Member = require('../../models/Member');

module.exports = asyncHandler(async (req, res, next) => {
	const bubble = req.f_bubble;
	const membersCount = await Member.countDocuments({ bubble: bubble._id });
	const plan = await Plan.findById(bubble.plan).select('total_members');

	if (
		plan.total_members !== 'unlimited' &&
		membersCount >= parseInt(plan.total_members)
	) {
		return next(
			new ErrorResponse(
				`Cannot add member, Your plan only supports a total of ${plan.total_members} members`,
				400
			)
		);
	}

	next();
});
