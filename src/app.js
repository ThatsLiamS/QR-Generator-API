const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');

const app = express();


// Application middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Routers
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/analytics', require('./routes/analytics'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/qrcodes', require('./routes/qrcodes'));
app.use('/api/v1/system', require('./routes/system'));
app.use('/api/v1/users', require('./routes/users'));


// Redirect routes (for tracking scans)
app.use('/r', require('./routes/redirect'));


// Error handler
app.use((req, _res, next) => {
	next({ statusCode: 404, name: 'NotFoundError', message: `Route not found: ${req.originalUrl}` });
});
app.use(require('./middleware/errorHandler'));


module.exports = app;
