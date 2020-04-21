const mongoose = require('mongoose');
const colors = require('colors');

mongoose
	.connect(process.env.MONGO_URI, {
		useFindAndModify: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log(
			`Database connected on host ${mongoose.connection.host}`.cyan.inverse
		);
	})
	.catch((err) => {
		if (err) {
			console.error(`Database error: ${err.stack}`.red);
			process.exit(0);
		}
	});
