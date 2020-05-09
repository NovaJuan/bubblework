const stripe = require('stripe')(process.env.STRIPE_SECRET);
const ErrorResponse = require('../../utils/ErrorResponse');

const handlers = {};

handlers.getAll = async () => {
	const results = await stripe.plans.list();
	return results.data;
};

handlers.getOne = async (id) => {
	const plan = await stripe.plans.retrieve(id);
	return plan;
};

handlers.create = async (plan) => {
	const stripe_plan = await stripe.plans.create({
		amount: parseInt(plan.price * 100),
		currency: 'usd',
		interval: 'month',
		nickname: plan.name,
		metadata: {
			description: plan.description,
			features: plan.features,
			total_members: plan.total_members,
		},
		product: process.env.STRIPE_PRODUCT,
		trial_period_days: process.env.STRIPE_TRIAL_DAYS,
	});

	return stripe_plan;
};

handlers.update = async (id, data) => {
	let plan = await stripe.plans.retrieve(id);

	let fields = {
		nickname: data.name || plan.nickname,
		active: data.active || plan.active,
		metadata: {
			description: data.description || plan.description,
			features: data.features || plan.features,
			total_members: data.total_members || plan.total_members,
		},
	};

	plan = await stripe.plans.update(id, fields);

	return plan;
};

handlers.delete = async (id) => {
	const confirmation = await stripe.plans.del(id);

	return confirmation;
};

module.exports = handlers;
