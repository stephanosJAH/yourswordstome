import {
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Email con acceso ilimitado
const UNLIMITED_ACCESS_EMAIL = 'estebanicamp@gmail.com';

/**
 * Verificar si el usuario tiene acceso ilimitado
 */
export const hasUnlimitedAccess = (userEmail) => {
  return userEmail === UNLIMITED_ACCESS_EMAIL;
};

/**
 * Obtener datos del usuario desde Firestore
 */
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    throw error;
  }
};

