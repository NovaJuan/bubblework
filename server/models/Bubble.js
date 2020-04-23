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

module.exports = mongoose.model('bubbles', BubbleSchema);
