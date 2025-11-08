import { OpenAIProvider } from './OpenAIProvider';
import { ClaudeProvider } from './ClaudeProvider';

/**
 * Factory para crear instancias de proveedores de IA
 */
export class AIProviderFactory {
  static providers = {
    openai: OpenAIProvider,
    claude: ClaudeProvider
  };

  /**
   * Crear proveedor de IA
   * @param {string} providerName - Nombre del proveedor ('openai', 'claude')
   * @param {string} apiKey - API key del proveedor
   * @returns {AIProvider} - Instancia del proveedor
   */
  static createProvider(providerName, apiKey) {
    const ProviderClass = this.providers[providerName.toLowerCase()];
    
    if (!ProviderClass) {
      throw new Error(`Proveedor desconocido: ${providerName}`);
    }

    return new ProviderClass(apiKey);
  }

  /**
   * Obtener lista de proveedores disponibles
   */
  static getAvailableProviders() {
    return Object.keys(this.providers);
  }
}
