// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';

// The Firebase Admin SDK to access Cloud Firestore.
import * as admin from 'firebase-admin';

var firebaseConfig = {
  apiKey: 'AIzaSyBW3gCiuVF8GbrKiiQwp4LfKeoxv-ehWrU',
  authDomain: 'presence-1a11c.firebaseapp.com',
  databaseURL: 'https://presence-1a11c.firebaseio.com',
  projectId: 'presence-1a11c',
  storageBucket: 'presence-1a11c.appspot.com',
  messagingSenderId: '813490720453',
  appId: '1:813490720453:web:5b5f018d48d8e4339b2aac',
};
admin.initializeApp(firebaseConfig);

export const checkAutoApproval = functions.firestore
  .document('presences/{eventId}/{userId}')
  .onWrite((snapshot, context) => {
    if (snapshot.before.exists) return null;

    const { eventId, userId } = context.params;

    admin
      .firestore()
      .collection(`events/${eventId}`)
      .where('userId', '==', userId);
    // Grab the current value of what was written to the Realtime Database.
    console.log('Uppercasing', context.params.pushId, original);
    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref?.parent?.child('uppercase').set(uppercase);
  });
