import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { hasUnlimitedAccess, getUserData } from './userService';

/**
 * Guardar un versículo generado en la subcolección del usuario
 * @param {string} userId - ID del usuario
 * @param {Object} verseData - Datos del versículo
 * @param {string} verseData.content - El texto del versículo personalizado
 * @param {string} verseData.reference - Referencia bíblica (ej: "Salmos 23:1")
 * @param {string} verseData.topic - Tema del versículo (ej: "Ansiedad")
 * @param {string} [verseData.originalText] - Texto original del versículo
 * @param {string} [verseData.aiProvider] - Proveedor de IA usado
 * @param {Object} options - Opciones adicionales
 * @param {boolean} [options.updateStats=false] - Si debe actualizar los contadores del usuario
 */
export const saveVerse = async (userId, verseData, options = {}) => {
  const { updateStats = false } = options;
  
  try {
    // 1. Referencia a la subcolección del usuario específico
    const versesRef = collection(db, 'users', userId, 'generated_verses');

    // 2. Guardar el versículo con los campos requeridos por las reglas de Firestore
    const docRef = await addDoc(versesRef, {
      verseReference: verseData.reference,       // Ej: "Salmos 23:1" - Campo requerido
      originalText: verseData.originalText || '', // Texto original - Campo requerido
      isFavorite: false,                    // Por defecto no es favorito - Campo requerido
      createdAt: serverTimestamp()          // Hora del servidor - Campo requerido
    });

    // 3. Actualizar contadores en el documento padre (User) solo si se solicita
    if (updateStats) {
      const userData = await getUserData(userId);
      const userRef = doc(db, 'users', userId);
      
      // Si tiene acceso ilimitado, no decrementar tokens
      if (userData && hasUnlimitedAccess(userData.email)) {
        await updateDoc(userRef, {
          totalGenerated: increment(1),
          lastGeneratedAt: serverTimestamp()
        });
      } else {
        await updateDoc(userRef, {
          tokens: increment(-1),              // Restar token
          totalGenerated: increment(1),       // Sumar al total
          lastGeneratedAt: serverTimestamp()
        });
      }
    }

    console.log("Versículo guardado" + (updateStats ? " y stats actualizados" : ""));
    return docRef.id;

  } catch (error) {
    console.error("Error guardando el versículo:", error);
    throw error;
  }
};

/**
 * Alternar el estado de favorito de un versículo
 * @param {string} userId - ID del usuario
 * @param {string} verseId - ID del documento del versículo
 * @param {boolean} currentStatus - Estado actual de isFavorite
 */
export const toggleFavorite = async (userId, verseId, currentStatus) => {
  try {
    // Referencia al documento específico del versículo
    const verseRef = doc(db, 'users', userId, 'generated_verses', verseId);

    // Actualizamos solo el campo isFavorite invirtiendo su valor actual
    await updateDoc(verseRef, {
      isFavorite: !currentStatus
    });

    console.log(`Favorito actualizado: ${!currentStatus}`);
    return !currentStatus;

  } catch (error) {
    console.error("Error actualizando favorito:", error);
    throw error;
  }
};

/**
 * Eliminar un versículo del historial
 * @param {string} userId - ID del usuario
 * @param {string} verseId - ID del documento del versículo
 */
export const deleteVerse = async (userId, verseId) => {
  try {
    const verseRef = doc(db, 'users', userId, 'generated_verses', verseId);
    await deleteDoc(verseRef);
    console.log("Versículo eliminado");
  } catch (error) {
    console.error("Error eliminando versículo:", error);
    throw error;
  }
};

/**
 * Actualizar el tema/topic de un versículo
 * @param {string} userId - ID del usuario
 * @param {string} verseId - ID del documento del versículo
 * @param {string} newTopic - Nuevo tema
 */
export const updateVerseTopic = async (userId, verseId, newTopic) => {
  try {
    const verseRef = doc(db, 'users', userId, 'generated_verses', verseId);
    await updateDoc(verseRef, {
      topic: newTopic
    });
    console.log("Topic actualizado");
  } catch (error) {
    console.error("Error actualizando topic:", error);
    throw error;
  }
};
