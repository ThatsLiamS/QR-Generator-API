/**
 * @group Middleware
 * @summary Formats and sends all uncaught and forwarded errors as a standardized JSON response.
 * @access Public
 * 
 * @returns {Error} Sends a JSON response to the client with the formatted error.
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
const errorHandler = (err, _req, res, _next) => {

	const errorResponse = {
		statusCode: err.statusCode || 500,
		status: 'error',
		name: err.name || 'UnknownError',
		message: err.message || 'An unexpected error occurred. Please try again later.',
	};

	if (process.env.isProduction === 'false' && err.stack) {
		errorResponse.stack = err.stack;
	}

	res.status(errorResponse.statusCode).json(errorResponse);
};


module.exports = errorHandler;
