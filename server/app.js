const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');
const colors = require('colors');
const compression = require('compression');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const decodeTokens = require('./middlewares/user/decodeTokens');

dotenv.config({
	path: path.join(__dirname, 'config/config.env'),
});

const app = express();

// Connect to MongoDB database
require('./database');

/*-----GLOBAL MIDDLEWARES-----*/
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(xss());
app.use(helmet());
app.use(
	rateLimiter({
		windowMs: 5 * 60 * 1000,
		max: 300,
	})
);
app.use(compression());
/*-----END OF GLOBAL MIDDLEWARES-----*/

// Decode Tokens Middleware
app.use(decodeTokens);

/*-----ROUTES-----*/
app.use('/api/v1', require('./routes/v1'));
/*-----END OFROUTES-----*/

// Error Handler
app.use(errorHandler);

module.exports = app;
