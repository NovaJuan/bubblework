const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please submit a task name.'],
		maxlength: 255,
	},
	description: {
		type: String,
		required: [true, 'Please submit a description.'],
	},
	bubble: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'bubbles',
		required: [true, 'bubble needed.'],
	},
	team: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'teams',
		required: [true, 'team needed.'],
	},
	created_by: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: [true, 'creator needed.'],
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('tasks', TaskSchema);
