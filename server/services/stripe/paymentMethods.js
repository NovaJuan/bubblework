const stripe = require('stripe')(process.env.STRIPE_SECRET);
const ErrorResponse = require('../../utils/ErrorResponse');
const formattedObject = require('../../utils/formattedObject');

exports.retrieve = async (pmId) => {
	const paymentMethod = await stripe.paymentMethods.retrieve(pmId);
	return paymentMethod;
};

exports.list = async (customerId) => {
	const { data } = await stripe.paymentMethods.list({
		customer: customerId,
		type: 'card',
	});
	return data;
};

exports.create = async ({ card, user, isDefault }) => {
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

	const customer = await stripe.customers.retrieve(user.stripe_customerid);

	const fields = {
		type: 'card',
		card: {
			number: card.number,
			exp_month: card.exp_month,
			exp_year: card.exp_year,
			cvc: card.cvc,
		},
		billing_details: {
			name: card.holder,
		},
	};

	let paymentMethod = await stripe.paymentMethods.create(fields);

	paymentMethod = await stripe.paymentMethods.attach(paymentMethod.id, {
		customer: customer.id,
	});

	if (isDefault || customer.invoice_settings.default_payment_method === null) {
		await stripe.customers.update(customer.id, {
			invoice_settings: {
				default_payment_method: paymentMethod.id,
			},
		});
	}

	return paymentMethod;
};

exports.update = async (pmId, card, isDefault = false, customerid) => {
	const fields = {
		card: {
			exp_month: card.exp_month,
			exp_year: card.exp_year,
		},
		billing_details: {
			name: card.holder,
		},
	};

	const pm = await stripe.paymentMethods.update(pmId, fields);

	if (isDefault) {
		await customers.setDefaultPaymentMethod(customerid, pmId);
	}

	return pm;
};

exports.remove = async (pmId) => {
	const pm = await stripe.paymentMethods.detach(pmId);
	return pm;
};
