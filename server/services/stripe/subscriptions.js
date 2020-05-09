const stripe = require('stripe')(process.env.STRIPE_SECRET);
const ErrorResponse = require('../../utils/ErrorResponse');

const handlers = {};

handlers.create = async (data) => {
	const { card, user, plan, bubble } = data;

	if (
		!card ||
		!card.holder ||
		!card.number ||
		!card.exp_month ||
		!card.cvc ||
		!card.exp_year
	) {
		throw new ErrorResponse(
			'Card info (holder, number, exp_month, exp_year, cvc) required.',
			400
		);
	}

	// Create Stripe customer
	let fields = {
		type: 'card',
		card: {
			number: card.number,
			exp_month: card.exp_month,
			exp_year: card.exp_year,
			cvc: card.cvc,
		},
		billing_details: {
			name: card.holder,
			email: user.email,
		},
	};

	const payment_method = await stripe.paymentMethods.create(fields);

	const customer = await stripe.customers.create({
		payment_method: payment_method.id,
		email: user.email,
		invoice_settings: {
			default_payment_method: payment_method.id,
		},
	});

	// Create stripe
	const subscription = stripe.subscriptions.create({
		customer: customer.id,
		items: [{ plan: `${plan.stripe_id}` }],
		metadata: {
			bubble: `${bubble._id}`,
		},
		trial_from_plan: true,
	});

	return subscription;
};

handlers.remove = async (subid) => {
	const confirmation = await stripe.subscriptions.del(subid);

	return confirmation;
};

module.exports = handlers;
