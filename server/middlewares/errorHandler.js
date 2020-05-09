const errorHandler = (err, req, res, next) => {
	console.error(err);

	let message = err.message || null;
	let statusCode = err.statusCode || null;

	if (err.name && err.name === 'ValidationError') {
		message = Object.values(err.errors).join(', ');
		statusCode = 400;
	}

	if (err.code === 11000) {
		const fields = Object.keys(err.keyValue);
		message = `Resource with that ${fields.join(' and ')} already exists.`;
		statusCode = 400;
	}

	if (err.name === 'CastError') {
		message = `Resource ID: ${err.value} is invalid`;
		statusCode = 404;
	}

	res.status(statusCode || 500).json({
		success: false,
		msg: message || 'Something went wrong',
		data: null,
	});
};

module.exports = errorHandler;
