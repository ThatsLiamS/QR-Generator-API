const path = require('path');

const cookieParser = require('cookie-parser');
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routers
const adminRouter = require('./routes/admin');
const analyticsRouter = require('./routes/analytics');
const authRouter = require('./routes/auth');
const qrRouter = require('./routes/qrcodes');
const systemRouter = require('./routes/system');
const userRouter = require('./routes/users');


// Mount routes
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/qrcodes', qrRouter);
app.use('/api/v1/system', systemRouter);
app.use('/api/v1/users', userRouter);


// Redirect routes (for tracking scans)
app.get('/r/:id', (_req, _res) => { /* redirect handler */ });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});


// error handler
app.use(function(err, req, res, _next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
