import { AIProviderFactory } from './ai';
import { fetchVerse } from './bibleService';
import { hasTokensAvailable, decrementTokens, saveToHistory } from './userService';

/**
 * Servicio principal para generar versículos personalizados
 */
export class VerseGeneratorService {
  constructor(providerName = 'openai', apiKey = null) {
    this.providerName = providerName;
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY;
    this.aiProvider = null;
  }

  /**
   * Configurar proveedor de IA
   */
  setProvider(providerName, apiKey) {
    this.providerName = providerName;
    this.apiKey = apiKey;
    this.aiProvider = null; // Reset para crear nuevo proveedor
  }

  /**
   * Obtener instancia del proveedor de IA
   */
  getAIProvider() {
    if (!this.aiProvider) {
      this.aiProvider = AIProviderFactory.createProvider(this.providerName, this.apiKey);
    }
    return this.aiProvider;
  }

  /**
   * Generar versículo personalizado
   * @param {Object} params
   * @param {string} params.userId - ID del usuario
   * @param {string} params.userName - Nombre del usuario
   * @param {string} params.verseReference - Referencia bíblica
   * @param {number} params.temperature - Temperatura de creatividad (0-1)
   * @returns {Promise<Object>} - Resultado de la generación
   */
  async generatePersonalizedVerse({ userId, userName, verseReference, temperature = 0.5 }) {
    try {
      // 1. Verificar tokens disponibles
      const hasTokens = await hasTokensAvailable(userId);
      if (!hasTokens) {
        throw new Error('insufficient_tokens');
      }

      // 2. Obtener texto original del versículo
      const verseData = await fetchVerse(verseReference);
      
      // 3. Generar versículo personalizado con IA
      const aiProvider = this.getAIProvider();
      const personalizedVerse = await aiProvider.generatePersonalizedVerse({
        verseText: verseData.text,
        verseReference: verseData.reference,
        userName,
        temperature
      });

      // 4. Decrementar tokens
      await decrementTokens(userId);

      // 5. Guardar en historial
      await saveToHistory(userId, {
        verseReference: verseData.reference,
        originalText: verseData.text,
        personalizedText: personalizedVerse,
        temperature,
        aiProvider: this.providerName
      });

      // 6. Retornar resultado
      return {
        success: true,
        data: {
          reference: verseData.reference,
          originalText: verseData.text,
          personalizedText: personalizedVerse,
          translation: verseData.translation_name
        }
      };

    } catch (error) {
      console.error('Error al generar versículo:', error);
      
      if (error.message === 'insufficient_tokens') {
        return {
          success: false,
          error: 'insufficient_tokens',
          message: 'No tienes tokens disponibles'
        };
      }

      return {
        success: false,
        error: 'generation_failed',
        message: error.message || 'Error al generar versículo personalizado'
      };
    }
  }
}

// Instancia singleton por defecto
let defaultService = null;

export const getVerseGeneratorService = () => {
  if (!defaultService) {
    defaultService = new VerseGeneratorService();
  }
  return defaultService;
};
