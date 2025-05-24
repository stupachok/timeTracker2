import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA68RSor6DkYO41goxk-xkoaxTJUgzhVqA",
  authDomain: "timetrackerapp-a5a23.firebaseapp.com",
  projectId: "timetrackerapp-a5a23",
  storageBucket: "timetrackerapp-a5a23.appspot.com",
  messagingSenderId: "549205412276",
  appId: "1:549205412276:android:9e4d20d2ac7c028a614ae1",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
