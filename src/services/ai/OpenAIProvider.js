import { AIProvider } from './AIProvider';

/**
 * Implementación de proveedor de IA usando OpenAI (ChatGPT)
 */
export class OpenAIProvider extends AIProvider {
  constructor(apiKey) {
    super(apiKey);
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-4'; // Usar gpt-4 o gpt-3.5-turbo según necesidad
  }

  async generatePersonalizedVerse({ verseText, verseReference, userName, temperature }) {
    if (!this.apiKey) {
      throw new Error('API key de OpenAI no configurada');
    }

    const prompt = this.buildPrompt(verseText, verseReference, userName, temperature);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente experto en teología y personalización de mensajes bíblicos.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: temperature,
          max_tokens: 300,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al generar versículo');
      }

      const data = await response.json();
      const personalizedVerse = data.choices[0].message.content.trim();
      
      // Limpiar comillas adicionales si las hay
      return personalizedVerse.replace(/^["']|["']$/g, '');
      
    } catch (error) {
      console.error('Error en OpenAI API:', error);
      throw error;
    }
  }
}
