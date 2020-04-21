const mongoose = require('mongoose');
const { genSalt, hash, compare } = require('bcryptjs');
const shortid = require('../utils/shortid');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	shortid: {
		type: String,
		default: shortid,
	},
	name: {
		type: String,
		required: [true, 'Please submit a name'],
		validate: {
			validator: (value) => value.length <= 100,
			message: 'Your name has to be less than 100 characters',
		},
	},
	username: {
		type: String,
		required: [true, 'Please submit a username'],
		unique: [true, 'That username already is registered'],
		match: [
			/^[a-zA-Z0-9&$_.-]{5,25}$/,
			'Username is not valid, has to be between 5 to 25 characters, and only can use this special characters: "& , $ , _ , . , -".',
		],
	},
	email: {
		type: String,
		required: [true, 'Please submit a email'],
		unique: [true, 'That email already is registered'],
		match: [
			/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
			'Please use a valid email',
		],
	},
	password: {
		type: String,
		required: [true, 'Please submit a password'],
		select: false,
		minlength: [6, 'Password has to be at least 6 characters'],
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'admin',
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	last_update: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre('save', async function (next) {
	this.last_update = Date.now();

	if (!this.isModified('password')) {
		return next();
	}

	const salt = await genSalt(10);
	this.password = await hash(this.password, salt);

	next();
});

UserSchema.methods.verifyPassword = async function (inputPass) {
	return compare(inputPass, this.password);
};

UserSchema.methods.getAuthToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.TOKEN_EXP_DAYS,
	});
};

module.exports = mongoose.model('users', UserSchema);
