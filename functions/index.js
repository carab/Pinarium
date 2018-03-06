const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
//const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = "crates";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

exports.onCrateCreated = functions.firestore
  .document("users/{userId}/crates/{crateId}")
  .onWrite(event => {
    // Get the crate document
    const crate = event.data.exists ? event.data.data() : null;
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    if (null === crate) {
      return index.deleteObject(event.params.crateId);
    } else {
      // Add an 'objectID' field which Algolia requires
      crate.objectID = event.params.crateId;

      // Write to the algolia index
      return index.saveObject(crate);
    }
  });
