import { 
  doc, 
  getDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  collection,
  addDoc
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

/**
 * Verificar si el usuario tiene tokens disponibles
 */
export const hasTokensAvailable = async (userId) => {
  const userData = await getUserData(userId);
  
  // Si tiene acceso ilimitado, siempre retorna true
  if (userData && hasUnlimitedAccess(userData.email)) {
    return true;
  }
  
  return userData && userData.tokens > 0;
};

/**
 * Decrementar tokens del usuario
 */
export const decrementTokens = async (userId) => {
  try {
    const userData = await getUserData(userId);
    
    // Si tiene acceso ilimitado, no decrementar tokens
    if (userData && hasUnlimitedAccess(userData.email)) {
      // Solo actualizar el contador de generaciones totales
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalGenerated: increment(1),
        lastGeneratedAt: serverTimestamp()
      });
      return;
    }
    
    // Usuario normal: decrementar tokens
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      tokens: increment(-1),
      totalGenerated: increment(1),
      lastGeneratedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error al decrementar tokens:', error);
    throw error;
  }
};

/**
 * Guardar versículo generado en el historial
 */
export const saveToHistory = async (userId, verseData) => {
  try {
    const historyRef = collection(db, 'users', userId, 'history');
    await addDoc(historyRef, {
      ...verseData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error al guardar en historial:', error);
    throw error;
  }
};

/**
 * Obtener tokens restantes del usuario
 */
export const getTokensRemaining = async (userId) => {
  const userData = await getUserData(userId);
  return userData ? userData.tokens : 0;
};
