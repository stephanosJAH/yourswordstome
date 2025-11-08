import { AIProvider } from './AIProvider';

/**
 * Implementación de proveedor de IA usando Anthropic Claude
 * (Preparado para uso futuro)
 */
export class ClaudeProvider extends AIProvider {
  constructor(apiKey) {
    super(apiKey);
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-sonnet-4-20250514';
  }

  async generatePersonalizedVerse({ verseText, verseReference, userName, temperature }) {
    if (!this.apiKey) {
      throw new Error('API key de Claude no configurada');
    }

    const prompt = this.buildPrompt(verseText, verseReference, userName, temperature);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 300,
          temperature: temperature,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al generar versículo');
      }

      const data = await response.json();
      const personalizedVerse = data.content[0].text.trim();
      
      return personalizedVerse.replace(/^["']|["']$/g, '');
      
    } catch (error) {
      console.error('Error en Claude API:', error);
      throw error;
    }
  }
}
