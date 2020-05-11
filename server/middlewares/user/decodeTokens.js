const asyncHandler = require('../../utils/asyncHandler');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

module.exports = asyncHandler(async (req, res, next) => {
	if (req.headers['authorization']) {
		let token = req.headers['authorization'];

		if (!token.includes('Bearer')) {
			return next();
		}

		token = token.replace('Bearer ', '');

		let decode;
		try {
			decode = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			next();
		}

		if (decode) {
			req.user = await User.findById(decode._id);
		}
	}
	next();
});
