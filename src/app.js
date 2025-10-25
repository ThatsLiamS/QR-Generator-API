const path = require('path');

const cookieParser = require('cookie-parser');
const express = require('express');
const firebaseAdmin = require('firebase-admin');
const createError = require('http-errors');
const logger = require('morgan');


// Initialize the Firebase Admin SDK
const serviceAccount = process.env.firebaseServiceKey;
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
});
console.log('Firebase Admin SDK initialized');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Application middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routers
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/analytics', require('./routes/analytics'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/qrcodes', require('./routes/qrcodes'));
app.use('/api/v1/system', require('./routes/system'));
app.use('/api/v1/users', require('./routes/users'));


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
