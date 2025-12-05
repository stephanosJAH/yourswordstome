import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toggleFavorite as toggleFavoriteService, deleteVerse } from '../services/verseHistoryService';

/**
 * Hook para obtener el historial de versículos generados del usuario
 * Soporta filtrado por favoritos y paginación
 * 
 * @param {string} userId - ID del usuario autenticado
 * @param {Object} options - Opciones de configuración
 * @param {number} [options.limitCount] - Límite de documentos a obtener
 * @returns {Object} - Estado y funciones del historial
 */
export const useVersesHistory = (userId, options = {}) => {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const { limitCount } = options;

  useEffect(() => {
    if (!userId) {
      setVerses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const versesRef = collection(db, 'users', userId, 'generated_verses');
    
    // Query base: Ordenar por fecha (más reciente primero)
    let q;
    
    if (favoritesOnly) {
      // Filtrar solo favoritos
      // Nota: Requiere un índice compuesto en Firestore (isFavorite + createdAt)
      q = query(
        versesRef, 
        where('isFavorite', '==', true), 
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(versesRef, orderBy('createdAt', 'desc'));
    }

    // Aplicar límite si se especifica
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const docsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convertir Timestamp a Date para facilitar el uso
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setVerses(docsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error en onSnapshot:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup: cancelar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, [userId, favoritesOnly, limitCount]);

  /**
   * Alternar el estado de favorito de un versículo
   */
  const toggleFavorite = useCallback(async (verseId, currentStatus) => {
    if (!userId) return;
    try {
      await toggleFavoriteService(userId, verseId, currentStatus);
    } catch (err) {
      console.error('Error al alternar favorito:', err);
      setError(err.message);
    }
  }, [userId]);

  /**
   * Eliminar un versículo del historial
   */
  const removeVerse = useCallback(async (verseId) => {
    if (!userId) return;
    try {
      await deleteVerse(userId, verseId);
    } catch (err) {
      console.error('Error al eliminar versículo:', err);
      setError(err.message);
    }
  }, [userId]);

  /**
   * Obtener solo los favoritos (filtro local)
   */
  const getFavorites = useCallback(() => {
    return verses.filter(verse => verse.isFavorite);
  }, [verses]);

  /**
   * Obtener versículos recientes (últimos N)
   */
  const getRecent = useCallback((count = 5) => {
    return verses.slice(0, count);
  }, [verses]);

  return { 
    verses,
    loading,
    error,
    favoritesOnly, 
    setFavoritesOnly,
    toggleFavorite,
    removeVerse,
    getFavorites,
    getRecent,
    totalCount: verses.length
  };
};

/**
 * Hook simplificado solo para favoritos
 * @param {string} userId - ID del usuario
 */
export const useFavoriteVerses = (userId) => {
  const result = useVersesHistory(userId);
  
  useEffect(() => {
    result.setFavoritesOnly(true);
  }, []);

  return {
    favorites: result.verses,
    loading: result.loading,
    error: result.error,
    toggleFavorite: result.toggleFavorite,
    removeVerse: result.removeVerse
  };
};

export default useVersesHistory;
