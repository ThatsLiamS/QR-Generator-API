const firebaseAdmin = require('firebase-admin');


const serviceAccount = JSON.parse(process.env.firebaseServiceKey);
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
});
const firestore = firebaseAdmin.firestore();

/**
 * @group Utility
 * @summary Deletes all documents matching a Firestore query in batches.
 * 
 * @returns {Promise<void>} A promise that resolves when all matching documents are deleted.
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
const deleteQueryBatch = async (query) => {
	const snapshot = await query.limit(500).get();

	if (snapshot.size === 0) { return; }

	const batch = firestore.batch();
	snapshot.docs.forEach(doc => {
		batch.delete(doc.ref);
	});
	await batch.commit();

	await deleteQueryBatch(query);
};
firestore.deleteQueryBatch = deleteQueryBatch;


module.exports = { firestore, firebaseAdmin };
