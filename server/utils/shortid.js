const shortID = require('shortid');

// Characters to use on the shorted id
shortID.characters(
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@+'
);

module.exports = () => shortID.generate();
