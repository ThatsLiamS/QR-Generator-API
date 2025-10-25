const admin = require('firebase-admin');

const checkAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).send({ error: 'Unauthorized: No token provided.' });
	}

	const idToken = authHeader.split('Bearer ')[1];

	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		req.user = decodedToken; 
	
		return next();
	} catch (error) {
		console.error('Error verifying token:', error);
		return res.status(403).send({ error: 'Forbidden: Invalid token.' });
	}
};


module.exports = checkAuth;
