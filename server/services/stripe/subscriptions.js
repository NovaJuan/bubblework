const stripe = require('stripe')(process.env.STRIPE_SECRET);
const ErrorResponse = require('../../utils/ErrorResponse');
const formattedObject = require('../../utils/formattedObject');

exports.create = async ({ customerid, plan, bubble, pm }) => {
	const fields = formattedObject({
		customer: customerid,
		items: [{ plan: `${plan.stripe_id}` }],
		metadata: {
			bubble: `${bubble._id}`,
		},
		default_payment_method: pm,
		trial_from_plan: true,
	});

	// Create stripe
	const subscription = stripe.subscriptions.create(fields);

	return subscription;
};

exports.changePlan = async (subid, newStripePlan) => {
	let subscription = await stripe.subscriptions.retrieve(subid);

	subscription = await stripe.subscriptions.update(subid, {
		items: [
			{
				id: subscription.items.data[0].id,
				plan: newStripePlan,
			},
		],
	});

	return subscription;
};

exports.changePaymentMethod = async (subid, pmId) => {
	let subscription = await stripe.subscriptions.update(subid, {
		default_payment_method: pmId,
	});

	return subscription;
};

exports.remove = async (subid) => {
	const confirmation = await stripe.subscriptions.del(subid);
	return confirmation;
};
