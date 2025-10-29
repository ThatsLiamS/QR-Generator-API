const express = require('express');

const { firestore, firebaseAdmin } = require('./../utility/firebase');
const router = express.Router();


// --- Public Routes ---

/**
 * @route GET /r/:shortCode
 * @group Redirect
 * @summary Redirects a user to the target URL based on a QR code's short code.
 * @access Public
 * 
 * @param {string} shortCode - The short code attribute of the QR code.
 * 
 * @returns {void} 302 - Redirects to the target URL.
 * @returns {Error} 400 - Bad Request. The QR code type is not 'url'.
 * @returns {Error} 404 - Not Found. No QR code found with this short code.
 * @returns {Error} 500 - An unexpected internal server error.
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.get('/:shortCode', async (req, res, next) => {
	const { shortCode } = req.params;

	try {

		const qrQuery = firestore.collection('qrcodes')
			.where('shortCode', '==', shortCode)
			.limit(1);

		const qrSnapshot = await qrQuery.get();
		if (!qrSnapshot || qrSnapshot.empty) {
			return next({
				statusCode: 404,
				name: 'NotFoundError',
				message: 'This QR code link is not valid.',
			});
		}

		const qrDoc = qrSnapshot.docs[0];
		const qrData = qrDoc.data();

		if (!qrData.ownerId || !qrData.targetData) {
  			return next({
				statusCode: 400,
				name: 'BadDataError',
				message: 'Invalid QR code data.',
			});
		}
		const qrCodeId = qrDoc.id;
		const ownerId = qrData.ownerId;
		
		if (qrData.type.toLowerCase() !== 'url' || !qrData.targetData.value) {
			return next({
				statusCode: 400,
				name: 'BadDataError',
				message: 'This QR code does not point to a web address.',
			});
		}
		const redirectUrl = qrData.targetData.value;

		firestore.collection('scanEvents')
			.add({
				qrCodeId,
				ownerId,
				timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
				ipAddress: req.ip,
				userAgent: req.headers['user-agent'] || '',
			})
			.then(() => firestore.collection('users').doc(ownerId)
				.update({
					totalScans: firebaseAdmin.firestore.FieldValue.increment(1),
				}))
			.catch();

		return res.redirect(302, redirectUrl);

	} catch {
		return next({
			statusCode: 500,
			name: 'RedirectError',
			message: 'An error occurred while processing the redirect.',
		});
	}
});


// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));


// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
