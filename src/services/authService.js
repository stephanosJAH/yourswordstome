import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();

/**
 * Iniciar sesión con Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar si el usuario existe en Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Si es un nuevo usuario, crear documento con tokens iniciales
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        tokens: 5, // 5 tokens gratuitos iniciales
        totalGenerated: 0,
        createdAt: serverTimestamp(),
        lastGeneratedAt: null
      });
    }

    return user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

/**
 * Cerrar sesión
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

/**
 * Observar cambios en el estado de autenticación
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
