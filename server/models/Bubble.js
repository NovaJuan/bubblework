const mongoose = require('mongoose');

const BubbleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please submit a name.'],
		maxlength: [255, 'Bubble name has to be less than 255 characters.'],
	},
	description: {
		type: String,
		required: [true, 'Please submit a description.'],
	},
	plan: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'plans',
	},
	last_payment: {
		type: Date,
	},
	stripe_subid: {
		type: String,
	},
	status: {
		type: String,
		default: 'active',
		enum: [
			'incomplete',
			'incomplete_expired',
			'trialing',
			'active',
			'past_due',
			'canceled',
			'unpaid',
		],
	},
	creator: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

BubbleSchema.index(
	{ name: 1, creator: 1 },
	{ unique: [true, 'You already created a bubble with that name.'] }
);

BubbleSchema.pre('remove', async function (next) {
	await this.model('members').deleteMany({ bubble: this._id });
	await this.model('teams').deleteMany({ bubble: this._id });
	await this.model('tasks').deleteMany({ bubble: this._id });
	next();
});

module.exports = mongoose.model('bubbles', BubbleSchema);
