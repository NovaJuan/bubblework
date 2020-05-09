const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please submit a team name.'],
		maxlength: 255,
	},
	bubble: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'bubbles',
		required: [true, 'bubble needed.'],
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

TeamSchema.index(
	{ bubble: 1, name: 1 },
	{ unique: [true, 'That team already exists.'] }
);

TeamSchema.pre('remove', async function (next) {
	await this.model('tasks').deleteMany({ team: this._id });
	next();
});

module.exports = mongoose.model('teams', TeamSchema);
