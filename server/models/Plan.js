const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please submit plan name.'],
		maxlength: 150,
		unique: true,
	},
	description: {
		type: String,
		required: [true, 'Please submit plan description.'],
	},
	price: {
		type: Number,
		required: [true, 'Please submit plan price.'],
	},
	features: {
		type: String,
		required: [true, 'Please submit plan features.'],
	},
	total_members: {
		type: String,
		required: [true, 'Please submit the total members that this plan allows.'],
		match: [
			/(unlimited|[0-9]+)/,
			"The total of members only can be a interger or 'unlimited'",
		],
	},
	stripe_id: {
		type: String,
	},
	active: {
		type: Boolean,
		default: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('plans', PlanSchema);
