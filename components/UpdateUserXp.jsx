import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const getXPFromPriority = (priority) => {
  switch (priority) {
    case 'low': return 1;
    case 'medium': return 2;
    case 'high': return 3;
    default: return 0;
  }
};

export const updateUserXP = async (userId, xpToAdd) => {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const currentXP = snap.data().totalXP || 0;
    await updateDoc(ref, { totalXP: currentXP + xpToAdd });
  } else {
    await setDoc(ref, { totalXP: xpToAdd });
  }
};
