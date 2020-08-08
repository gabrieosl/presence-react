const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { addDays, isBefore, isToday } = require('date-fns');

var firebaseConfig = {
  apiKey: 'AIzaSyDQ3BrKjqHO6-nulN_wdIfNA0MxnSYkp5g',
  authDomain: 'presence2-2102e.firebaseapp.com',
  databaseURL: 'https://presence2-2102e.firebaseio.com',
  projectId: 'presence2-2102e',
  storageBucket: 'presence2-2102e.appspot.com',
  messagingSenderId: '175852709214',
  appId: '1:175852709214:web:2442d488903fc2d1475bcf',
};
admin.initializeApp(firebaseConfig);
const db = admin.firestore();

async function getLastUserConfirmedEvent(userId) {
  const recentEventsSnapshot = await db
    .collectionGroup('confirmed')
    .where('userId', '==', userId)
    .orderBy('eventDate', 'desc')
    .limit(1)
    .get();
  let recentEvent;
  recentEventsSnapshot.forEach(event => {
    recentEvent = event.data();
  });

  return recentEvent;
}

exports.confirmPresence = functions
  .region('us-central1')
  .firestore.document('/events/{eventId}/requested/{requestId}')
  .onCreate(async (snap, context) => {
    const userId = snap.data().userId;

    const { eventId } = context.params;
    functions.logger.log('Confirming', userId, 'on', eventId);

    const eventDoc = await db.doc(`events/${eventId}`).get();

    const confirmedCount = eventDoc.get('confirmedCount') || 0;
    const maxAttendees = eventDoc.get('maxAttendees');

    if (!(confirmedCount < maxAttendees)) {
      return snap.ref.set({ response: 'FULL' }, { merge: true });
    }

    const isUserAlreadyConfirmed = !(
      await db
        .collection(`events/${eventId}/confirmed`)
        .where('userId', '==', userId)
        .get()
    ).empty;
    if (isUserAlreadyConfirmed) {
      return snap.ref.set({ response: 'reconfirmed' }, { merge: true });
    }

    const eventDate = eventDoc.get('date');

    const lastConfirmedEvent = await getLastUserConfirmedEvent(userId);
    functions.logger.log(`testando max ${maxAttendees} -`, eventDate);

    const canUserConfirmAgain =
      !lastConfirmedEvent ||
      isBefore(
        addDays(new Date(lastConfirmedEvent.eventDate._seconds * 1000), 30),
        new Date(),
      );

    const isEventToday = isToday(new Date(eventDate._seconds * 1000));
    functions.logger.log(
      `istoday ${isEventToday ? 'sim' : 'nap'}`,
      String(new Date(eventDate._seconds * 1000)),
    );

    if (canUserConfirmAgain || isEventToday) {
      await snap.ref.set({ response: 'confirmed' }, { merge: true });
      await db
        .collection(`events/${eventId}/confirmed`)
        .add({ userId, userName: snap.get('userName'), eventDate });
      return eventDoc.ref.set(
        { confirmedCount: confirmedCount + 1 },
        { merge: true },
      );
    }

    return snap.ref.set({ response: 'WAIT' }, { merge: true });
  });

exports.deletePresence = functions
  .region('us-central1')
  .firestore.document('/events/{eventId}/confirmed/{requestId}')
  .onDelete(async (snap, context) => {
    const eventDoc = await db.doc(`events/${eventId}`).get();

    const confirmedCount = eventDoc.get('confirmedCount');

    return eventDoc.ref.set(
      { confirmedCount: confirmedCount - 1 },
      { merge: true },
    );
  });
