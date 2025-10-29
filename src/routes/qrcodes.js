const express = require('express');

const { firestore } = require('./../utility/firebase');
const router = express.Router();

// --- Public Routes ---


// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));

/**
 * @route GET /qrcodes
 * @group QRCodes
 * @summary Lists all QR Codes for the currently authenticated user
 * @access Private (Authenticated)
 * 
 * @returns {Object[]} 200 - An array of the user's QR code objects
 * @returns {Error} 500 - An unexpected internal server error
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.get('/', async (req, res, next) => {
	const authenticatedUserId = req.user.uid;

	try {

		const snapshot = await firestore.collection('qrcodes')
			.where('ownerId', '==', authenticatedUserId)
			.get();

		if (!snapshot || snapshot.empty) {
			return res.status(200).send([]);
		}

		const qrcodes = snapshot.docs.map(qrcodesDoc => ({
			qrcodeId: qrcodesDoc.id,
			...qrcodesDoc.data(),
		}));

		return res.status(200).send(qrcodes);

	} catch {
		return next({
			statusCode: 500,
			name: 'DatabaseError',
			message: 'Failed to fetch user QR codes.',
		});
	}
});

/**
 * @route GET /qrcodes/:shortCode
 * @group QRCodes
 * @summary Retrieves the data for a single QR code
 * @access Private (Authenticated)
 * 
 * @param {string} shortCode - The short code attribute of the QR code.
 * 
 * @returns {Object} 200 - The QR code document data.
 * @returns {Error} 403 - Forbidden. The QR code exists but does not belong to the authenticated user.
 * @returns {Error} 404 - Not Found. No QR code found with this short code.
 * @returns {Error} 500 - Internal Server Error.
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.get('/:shortCode', async (req, res, next) => {
	const { shortCode } = req.params;
	const authenticatedUserId = req.user.uid;

	try {

		const qrSnapshot = await firestore.collection('qrcodes')
			.where('shortCode', '==', shortCode)
			.limit(1)
			.get();

		if (!qrSnapshot || qrSnapshot.empty) {
			return next({
				statusCode: 404,
				name: 'NotFoundError',
				message: 'This QR short code is not valid.',
			});
		}

		const qrDoc = qrSnapshot.docs[0];
		const qrData = qrDoc.data();

		if (!qrData.ownerId || qrData.ownerId !== authenticatedUserId) {
			return next({
				statusCode: 403,
				name: 'ForbiddenError',
				message: 'You do not have permission to access this QR code.',
			});
		}

		return res.status(200).json(qrData);

	} catch {
		return next({
			statusCode: 500,
			name: 'DatabaseError',
			message: 'Failed to fetch the QR code.',
		});
	}
});

/**
 * @route PUT /qrcodes/:shortCode
 * @group QRCodes
 * @summary Updates a QR code's data
 * @access Private (Authenticated)
 * 
 * @param {string} shortCode - The short code attribute of the QR code.
 * 
 * @returns {Object} 200 - Confirmation object with updated fields.
 * @returns {Error} 400 - Bad Request. No valid fields to update were provided.
 * @returns {Error} 403 - Forbidden. The QR code exists but does not belong to the authenticated user.
 * @returns {Error} 404 - Not Found. No QR code found with this short code.
 * @returns {Error} 500 - Internal Server Error.
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.put('/:shortCode', async (req, res, next) => {
	const { shortCode } = req.params;
	const authenticatedUserId = req.user.uid;

	const { label, type, targetData } = req.body;
	const updateData = {};

	if (label !== undefined && label !== null) {
		updateData.label = label;
	}
	if (type !== undefined && type !== null) {
		updateData.type = type;
	}
	if (targetData && targetData.value !== null && targetData.value !== undefined) {
		updateData.targetData = {
			value: targetData.value,
		};
	}

	if (Object.keys(updateData).length === 0) {
		return next({
			statusCode: 400,
			name: 'BadRequestError',
			message: 'No valid fields to update were provided.',
		});
	}

	try {

		const qrSnapshot = await firestore.collection('qrcodes')
			.where('shortCode', '==', shortCode)
			.limit(1)
			.get();

		if (!qrSnapshot || qrSnapshot.empty) {
			return next({
				statusCode: 404,
				name: 'NotFoundError',
				message: 'This QR short code is not valid.',
			});
		}

		const qrDoc = qrSnapshot.docs[0];
		const qrData = qrDoc.data();

		if (!qrData.ownerId || qrData.ownerId !== authenticatedUserId) {
			return next({
				statusCode: 403,
				name: 'ForbiddenError',
				message: 'You do not have permission to access this QR code.',
			});
		}

		await qrDoc.ref.update(updateData);

		return res.status(200).json({
			message: 'QR Code updated successfully.',
			changes: updateData,
		});

	} catch {
		return next({
			statusCode: 500,
			name: 'DatabaseError',
			message: 'Failed to update QR code.',
		});
	}
});

/**
 * @route DELETE /qrcodes/:shortCode
 * @group QRCodes
 * @summary Deletes a QR code by its short code
 * @access Private (Authenticated)
 * 
 * @param {string} shortCode - The short code attribute of the QR code.
 * 
 * @returns {void} 204 - No Content. The QR code was successfully deleted.
 * @returns {Error} 403 - Forbidden. The QR code exists but does not belong to the authenticated user.
 * @returns {Error} 404 - Not Found. No QR code found with this short code.
 * @returns {Error} 500 - Internal Server Error.
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.delete('/:shortCode', async (req, res, next) => {
	const { shortCode } = req.params;
	const authenticatedUserId = req.user.uid;

	try {

		const qrSnapshot = await firestore.collection('qrcodes')
			.where('shortCode', '==', shortCode)
			.limit(1)
			.get();

		if (!qrSnapshot || qrSnapshot.empty) {
			return next({
				statusCode: 404,
				name: 'NotFoundError',
				message: 'This QR short code is not valid.',
			});
		}

		const qrDoc = qrSnapshot.docs[0];
		const qrData = qrDoc.data();

		if (!qrData.ownerId || qrData.ownerId !== authenticatedUserId) {
			return next({
				statusCode: 403,
				name: 'ForbiddenError',
				message: 'You do not have permission to access this QR code.',
			});
		}

		await qrDoc.ref.delete();
		return res.status(204).end();

	} catch {
		return next({
			statusCode: 500,
			name: 'DatabaseError',
			message: 'Failed to delete QR code.',
		});
	}
});


// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
