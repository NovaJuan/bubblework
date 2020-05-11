const stripe = require('stripe')(process.env.STRIPE_SECRET);
const ErrorResponse = require('../../utils/ErrorResponse');
const formattedObject = require('../../utils/formattedObject');

exports.retrieve = async (customerId) => {
	const customer = await stripe.customers.retrieve(customerId);
	return customer;
};

exports.create = async (user) => {
	const customer = await stripe.customers.create({
		email: user.email,
		name: user.name,
		description: 'Customer of BubbleWork.',
	});

	return customer;
};

exports.update = async (customerid, fields) => {
	const customer = await stripe.customers.update(customerid, fields);

	return customer;
};

exports.setDefaultPaymentMethod = async (customerid, pmId) => {
	await stripe.customers.update(customerid, {
		invoice_settings: {
			default_payment_method: pmId,
		},
	});
};

exports.getDefaultPaymentMethod = async (customerid) => {
	const customer = await stripe.customers.retrieve(customerid);
	const pmId = customer.invoice_settings.default_payment_method;

	if (!pmId) {
		throw new ErrorResponse(`User doesn't have a default payment method`, 404);
	}

	const pm = await stripe.paymentMethods.retrieve(pmId);

	return pm;
};
