import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

/**
 * Servicio para generar versículos personalizados usando Cloud Functions
 * 
 * Toda la lógica crítica (verificación de tokens, generación con IA, 
 * guardado en Firestore) se ejecuta en el servidor para mayor seguridad.
 */

/**
 * Generar versículo personalizado llamando a la Cloud Function
 * @param {Object} params
 * @param {string} params.userName - Nombre del usuario para personalización
 * @param {string} params.verseReference - Referencia bíblica (ej: "Juan 3:16")
 * @param {number} params.temperature - Temperatura de creatividad (0-1)
 * @returns {Promise<Object>} - Resultado de la generación
 */
export const generatePersonalizedVerse = async ({ userName, verseReference, temperature = 0.5 }) => {
  try {
    // Llamar a la Cloud Function
    const generateVerseFunction = httpsCallable(functions, 'generateVerse');
    
    const result = await generateVerseFunction({
      userName,
      verseReference,
      temperature
    });

    // La Cloud Function retorna { success: true, data: {...} }
    return result.data;

  } catch (error) {
    console.error('Error al generar versículo:', error);

    // Manejar errores específicos de Cloud Functions
    if (error.code === 'functions/unauthenticated') {
      return {
        success: false,
        error: 'unauthenticated',
        message: 'Debes iniciar sesión para generar versículos'
      };
    }

    if (error.code === 'functions/resource-exhausted') {
      return {
        success: false,
        error: 'insufficient_tokens',
        message: 'No tienes tokens disponibles'
      };
    }

    if (error.code === 'functions/invalid-argument') {
      return {
        success: false,
        error: 'invalid_argument',
        message: error.message || 'Parámetros inválidos'
      };
    }

    return {
      success: false,
      error: 'generation_failed',
      message: error.message || 'Error al generar versículo personalizado'
    };
  }
};

/**
 * Obtener tokens restantes del usuario
 * @returns {Promise<Object>} - { tokens, totalGenerated, isUnlimited }
 */
export const getTokensRemaining = async () => {
  try {
    const getTokensFunction = httpsCallable(functions, 'getTokensRemaining');
    const result = await getTokensFunction();
    return result.data;
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    return { tokens: 0, totalGenerated: 0, isUnlimited: false };
  }
};

/**
 * Clase legacy para compatibilidad con código existente
 * @deprecated Usar las funciones exportadas directamente
 */
export class VerseGeneratorService {
  constructor() {
    console.warn('VerseGeneratorService class is deprecated. Use generatePersonalizedVerse() function directly.');
  }

  async generatePersonalizedVerse({ userId, userName, verseReference, temperature = 0.5 }) {
    // userId ya no es necesario, la Cloud Function lo obtiene del token de auth
    return generatePersonalizedVerse({ userName, verseReference, temperature });
  }
}

// Instancia singleton por defecto (legacy)
let defaultService = null;

export const getVerseGeneratorService = () => {
  if (!defaultService) {
    defaultService = new VerseGeneratorService();
  }
  return defaultService;
};
