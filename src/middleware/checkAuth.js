const { firebaseAdmin } = require('./../utility/firebase');

/**
 * @group Middleware
 * @summary Checks if the request is authenticated and attaches user information
 * @access Private (Authenticated)
 * 
 * @returns {void} Calls `next()` on success to pass control to the next handler.
 * @returns {Error} 401 - Forwards an 'UnauthorizedError' if no token is provided.
 * @returns {Error} 403 - Forwards a 'ForbiddenError' if the token is invalid or expired.
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
const checkAuth = async (req, _res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return next({ statusCode: 401, name: 'UnauthorizedError', message: 'Unauthorized: No token provided.' });
	}

	const idToken = authHeader.split('Bearer ')[1];

	try {
		const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
		req.user = decodedToken; 

		return next();
	} catch {
		return next({ statusCode: 403, name: 'ForbiddenError', message: 'Forbidden: Invalid token.' });
	}
};


module.exports = checkAuth;
