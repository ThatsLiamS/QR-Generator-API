/**
 * @group Middleware
 * @summary Handles all uncaught and forwarded errors across the Express app.
 * 
 * @returns {Error} Sends a standardized JSON error response
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
const errorHandler = (err, _req, res, _next) => {

	const jsonResponse = {
		statusCode: err.statusCode || 500,
		status: 'error',
		name: err.name || 'UnknownError',
		message: err.message || 'An unexpected error occurred. Please try again later.',
	};

	if (process.env.isProduction === 'false' && err.stack) {
		jsonResponse.stack = err.stack;
	}

	res.status(jsonResponse.statusCode).json(jsonResponse);
};

module.exports = errorHandler;
