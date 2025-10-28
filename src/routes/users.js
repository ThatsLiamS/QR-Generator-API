const express = require('express');

const { firestore, firebaseAdmin } = require('./../utility/firebase');
const router = express.Router();


// --- Public Routes ---


// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));

/**
 * @route GET /users/me
 * @group Users
 * @access Private (Authenticated)
 * @summary Get the currently authenticated user's profile
 * 
 * @returns {Object} 200 - The user profile object
 * @returns {Error} 404 - User profile not found in database
 * @returns {Error} 500 - An unexpected internal server error
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.get('/me', async (req, res, next) => {
	const authenticatedUserId = req.user.uid;
	
	try {
		const userRef = firestore.collection('users').doc(authenticatedUserId);
		const userDoc = await userRef.get();

		if (!userDoc || !userDoc.exists) {
			return next({ statusCode: 404, name: 'NotFoundError', message: 'User profile not found.' });
		}

		return res.status(200).send(userDoc.data());

	} catch {
		return next({ statusCode: 500, name: 'DatabaseError', message: 'Failed to fetch user profile.' });
	}
});

/**
 * @route PUT /users/me
 * @group Users
 * @access Private (Authenticated)
 * @summary Update the currently authenticated user's profile
 * 
 * @returns {Object} 200 - A confirmation object, with updated fields
 * @returns {Error} 400 - No valid fields to update were provided
 * @returns {Error} 500 - An unexpected internal server error
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.put('/me', async (req, res, next) => {
	const authenticatedUserId = req.user.uid;
	
	const { email, displayName, avatarUrl } = req.body;
	const updateData = {};

	if (email !== undefined && email !== null) {
		updateData.email = email;
	}
	if (displayName !== undefined && displayName !== null) {
		updateData.displayName = displayName;
	}
	if (avatarUrl !== undefined && avatarUrl !== null) {
		updateData.avatarUrl = avatarUrl;
	}

	if (Object.keys(updateData).length === 0) {
		return next({ statusCode: 400, name: 'BadRequestError', message: 'No valid fields to update were provided.' });
	}

	try {
		const userRef = firestore.collection('users').doc(authenticatedUserId);
		await userRef.update(updateData);

		return res.status(200).send({
			message: 'Profile updated successfully',
			changes: updateData,
		});

	} catch {
		return next({ statusCode: 500, name: 'DatabaseError', message: 'Failed to update user profile.' });
	}
});

/**
 * @route DELETE /users/me
 * @group Users
 * @access Private (Authenticated)
 * @summary Delete all associated data with the currently authenticated user
 * 
 * @returns {null} 204 - No content. Confirms successful deletion
 * @returns {Error} 500 - An unexpected internal server error
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.delete('/me', async (req, res, next) => {
	const authenticatedUserId = req.user.uid;

	try {
		const scanEventsQuery = firestore.collection('scanEvents').where('ownerId', '==', authenticatedUserId);
		await firestore.deleteQueryBatch(scanEventsQuery);

		const qrcodesQuery = firestore.collection('qrcodes').where('ownerId', '==', authenticatedUserId);
		await firestore.deleteQueryBatch(qrcodesQuery);

		const userRef = firestore.collection('users').doc(authenticatedUserId);
		await userRef.delete();

		await firebaseAdmin.auth().deleteUser(authenticatedUserId);

		return res.status(204).send();

	} catch {
		return next({ statusCode: 500, name: 'CascadingDeleteError', message: 'Failed to delete all associated data.' });
	}
});

/**
 * @route GET /users/me/qrcodes
 * @group Users
 * @access Private (Authenticated)
 * @summary Lists all QR Codes for the currently authenticated user
 * 
 * @returns {Object[]} 200 - An array of the user's QR code objects
 * @returns {Error} 500 - An unexpected internal server error
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.get('/me/qrcodes', async (req, res, next) => {
	const authenticatedUserId = req.user.uid;

	try {
		const qrcodesRef = firestore.collection('qrcodes');
		const snapshot = await qrcodesRef.where('ownerId', '==', authenticatedUserId).get();

		if (!snapshot || snapshot.empty) {
			return res.status(200).send([]);
		}

		const qrcodes = snapshot.docs.map(qrcodesDoc => ({
			qrcodeId: qrcodesDoc.id,
			...qrcodesDoc.data(),
		}));

		return res.status(200).send(qrcodes);

	} catch {
		return next({ statusCode: 500, name: 'DatabaseError', message: 'Failed to fetch user QR codes.' });
	}
});


// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
