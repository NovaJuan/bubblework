const errorHandler = (err, req, res, next) => {
	console.error(err);

	let message = err.message || null;
	let statusCode = err.statusCode || null;

	if (err.name && err.name === 'ValidationError') {
		message = Object.values(err.errors).join(', ');
		statusCode = 400;
	}

	if (err.code === 11000) {
		message = 'Duplicated key value.';
		statusCode = 400;
	}

	res.status(statusCode || 500).json({
		success: false,
		msg: message || 'Something went wrong',
		data: null,
	});
};

module.exports = errorHandler;
