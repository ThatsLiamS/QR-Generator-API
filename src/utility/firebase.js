const firebaseAdmin = require('firebase-admin');


const serviceAccount = JSON.parse(process.env.firebaseServiceKey);
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
});
const firestore = firebaseAdmin.firestore();


async function deleteQueryBatch(query, database) {
	const snapshot = await query.limit(500).get();

	if (snapshot.size === 0) { return; }

	const batch = database.batch();
	snapshot.docs.forEach(doc => {
		batch.delete(doc.ref);
	});
	await batch.commit();

	await deleteQueryBatch(query, database);
}
firestore.deleteQueryBatch = deleteQueryBatch;


module.exports = firestore;
