// src/lib/firebase.js
// Lightweight Firebase (Firestore) helper. Uses Vite env vars.
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, set as rtdbSet, push, onValue, off, query, orderByChild, update as rtdbUpdate } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAKwB7v9CUaniJbSohzVCKh7jTjvo-XflA",
  authDomain: "alcaritas.firebaseapp.com",
  databaseURL: "https://alcaritas-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alcaritas",
  storageBucket: "alcaritas.firebasestorage.app",
  messagingSenderId: "1075219304852",
  appId: "1:1075219304852:web:781268b31ce620a68a3f81",
  measurementId: "G-3JRF51F1BK"
};

let firestoreDb = null;
let realtimeDb = null;
let app = null;
try {
  app = initializeApp(firebaseConfig);
  try {
    firestoreDb = getFirestore(app);
  } catch (e) {
    // firestore may not be available in some builds/environments
    // eslint-disable-next-line no-console
    console.warn('Firestore init failed', e);
  }

  try {
    // initialize realtime DB only if databaseURL is provided
    if (firebaseConfig.databaseURL) {
      realtimeDb = getDatabase(app);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Realtime DB init failed', e);
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('Firebase initialization failed', err);
}

// Firestore save (existing behaviour)
export async function saveRequest(requestId, data) {
  if (!firestoreDb) throw new Error('Firestore not initialized. Set VITE_FIREBASE_* env vars.');
  const docRef = doc(firestoreDb, 'requests', String(requestId));
  await setDoc(docRef, data, { merge: true });
  return docRef;
}

// Realtime Database save helper
export async function saveRequestRealtime(requestId, data) {
  if (!realtimeDb) throw new Error('Realtime Database not initialized. Set VITE_FIREBASE_DATABASE_URL in .env');
  const nodeRef = ref(realtimeDb, `requests/${String(requestId)}`);
  await rtdbSet(nodeRef, data);
  return nodeRef;
}

// Profile save helpers
export async function saveProfileRealtime(profileKey, data) {
  if (!realtimeDb) throw new Error('Realtime Database not initialized. Set VITE_FIREBASE_DATABASE_URL in .env');
  const nodeRef = ref(realtimeDb, `profiles/${String(profileKey)}`);
  await rtdbSet(nodeRef, data);
  return nodeRef;
}

export async function saveProfile(profileKey, data) {
  if (!firestoreDb) throw new Error('Firestore not initialized. Set VITE_FIREBASE_* env vars.');
  const docRef = doc(firestoreDb, 'profiles', String(profileKey));
  await setDoc(docRef, data, { merge: true });
  return docRef;
}

// Messaging helpers (Realtime Database)
export async function sendMessage(chatId, message) {
  if (!realtimeDb) throw new Error('Realtime Database not initialized. Set VITE_FIREBASE_DATABASE_URL in .env');
  const msgsRef = ref(realtimeDb, `chats/${String(chatId)}/messages`);
  // push writes a new child with a unique key
  const timestamp = message.timestamp || Date.now();
  const payload = { ...message, timestamp };
  const pushedRef = await push(msgsRef, payload);

  // update chat metadata (last message + time) to help list views show new activity
  try {
    const metaRef = ref(realtimeDb, `chats/${String(chatId)}/meta`);
    await rtdbUpdate(metaRef, { lastMsg: message.text || '', lastMsgTime: timestamp });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to update chat meta', e);
  }

  return pushedRef;
}

export function subscribeToChatMessages(chatId, onMessages) {
  if (!realtimeDb) {
    // no-op when RTDB not available
    // eslint-disable-next-line no-console
    console.warn('subscribeToChatMessages: Realtime DB not initialized');
    return () => {};
  }

  const msgsQuery = query(ref(realtimeDb, `chats/${String(chatId)}/messages`), orderByChild('timestamp'));
  const listener = onValue(msgsQuery, (snapshot) => {
    const val = snapshot.val() || {};
    const arr = Object.keys(val)
      .map((k) => ({ id: k, ...val[k] }))
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    onMessages(arr);
  });

  return () => {
    try {
      off(msgsQuery);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error removing RTDB listener', e);
    }
  };
}

// Subscribe to chats list and their meta (for chat list views)
export function subscribeToChats(onChats) {
  if (!realtimeDb) {
    // eslint-disable-next-line no-console
    console.warn('subscribeToChats: Realtime DB not initialized');
    return () => {};
  }

  const chatsRef = ref(realtimeDb, 'chats');
  const listener = onValue(chatsRef, (snapshot) => {
    const val = snapshot.val() || {};
    const list = Object.keys(val).map((k) => {
      const meta = val[k].meta || {};
      return {
        id: k,
        name: meta.name || meta.title || `Chat ${k}`,
        avatar: meta.avatar || '',
        lastMsg: meta.lastMsg || '',
        lastMsgTime: meta.lastMsgTime || 0,
      };
    });

    // sort by lastMsgTime desc
    list.sort((a, b) => (b.lastMsgTime || 0) - (a.lastMsgTime || 0));
    onChats(list);
  });

  return () => {
    try {
      off(chatsRef);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error removing chats listener', e);
    }
  };
}

// Create a new chat with meta information. Returns the new chatId.
export async function createChat(meta = {}) {
  if (!realtimeDb) throw new Error('Realtime Database not initialized. Set VITE_FIREBASE_DATABASE_URL in .env');
  const chatsRef = ref(realtimeDb, 'chats');
  const node = await push(chatsRef, { meta });
  return node.key;
}

export { firestoreDb as db, realtimeDb as rtdb, app };
