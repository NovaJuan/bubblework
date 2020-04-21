const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(`Server on ${process.env.NODE_ENV} on port ${PORT}`.green.inverse)
);

process.on('unhandledRejection', (err, promise) => {
	console.error(`Unhandle Rejection : ${err.stack}`.red);
	server.close(() => process.exit(0));
});
