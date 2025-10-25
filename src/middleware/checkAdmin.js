const checkAdmin = (req, res, next) => {

	if (!req.user) {
		return res.status(401).send({ error: 'Unauthorized: No user found. ' });
	}

	if (req.user.isAdmin === true) {
		return next();
	} else {
		return res.status(403).send({ error: 'Forbidden: Admin access required.' });
	}
};


module.exports = checkAdmin;
