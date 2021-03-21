const admin = require("firebase-admin");

const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://space-budz.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
