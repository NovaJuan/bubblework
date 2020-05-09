const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
	user: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: [true, 'user needed.'],
	},
	bubble: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'bubbles',
		required: [true, 'bubble needed.'],
	},
	since: {
		type: Date,
		default: Date.now,
	},
	role: {
		type: String,
		enum: ['leader', 'manager', 'worker', 'creator'],
		required: [true, 'role needed.'],
	},
});

MemberSchema.index(
	{ bubble: 1, user: 1 },
	{ unique: [true, 'That user is already added to this bubble.'] }
);

MemberSchema.index(
	{ bubble: 1, role: 1 },
	{
		unique: [true, 'Only can be one creator per bubble.'],
		partialFilterExpression: { role: 'creator' },
	}
);

module.exports = mongoose.model('members', MemberSchema);
