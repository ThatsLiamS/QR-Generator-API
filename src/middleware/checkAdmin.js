/**
 * @group Middleware
 * @summary Checks if the authenticated user has admin privileges.
 * @access Private (Admin)
 * 
 * @returns {void} Calls `next()` on success to pass control to the next handler.
 * @returns {Error} 401 - Forwards an 'UnauthorizedError' if no user is found on the request.
 * @returns {Error} 403 - Forwards a 'ForbiddenError' if the user is not an admin.
 *
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
const checkAdmin = (req, _res, next) => {

	if (!req.user) {
		return next({ statusCode: 401, name: 'UnauthorizedError', message: 'Unauthorized: No user found.' });
	}

	if (req.user.isAdmin === true) {
		return next();
	} else {
		return next({ statusCode: 403, name: 'ForbiddenError', message: 'Forbidden: Admin access required.' });
	}
};


module.exports = checkAdmin;
