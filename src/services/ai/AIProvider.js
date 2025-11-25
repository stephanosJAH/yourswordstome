/**
 * Interface abstracta para proveedores de IA
 * Permite cambiar fácilmente entre diferentes APIs (OpenAI, Claude, etc.)
 */
export class AIProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Método abstracto para generar versículo personalizado
   * @param {Object} params - Parámetros de generación
   * @param {string} params.verseText - Texto original del versículo
   * @param {string} params.verseReference - Referencia bíblica
   * @param {string} params.userName - Nombre del usuario
   * @param {number} params.temperature - Temperatura de creatividad (0-1)
   * @returns {Promise<string>} - Versículo personalizado
   */
  async generatePersonalizedVerse(params) {
    throw new Error('Method not implemented');
  }

  /**
   * Construir prompt para personalización de versículo
   */
  buildPrompt(verseText, verseReference, userName, temperature) {
    const creativityLevel = 
      temperature < 0.3 ? 'literal' :
      temperature <= 0.6 ? 'balanceado' : 'creativo';

    return `Eres un teólogo experto en personalizar mensajes bíblicos.

Versículo original: "${verseText}"
Referencia: ${verseReference}

Tarea: Personaliza este versículo para ${userName}, manteniendo el mensaje espiritual y la esencia del texto. Incorpora el nombre de manera natural.

Reglas:
- Mantén el tono devocional y respetuoso
- El mensaje debe ser claro y edificante
- Longitud similar al original (máximo 2-3 líneas más)
- No inventes doctrinas ni cambies el significado teológico
- Estilo de creatividad: ${creativityLevel}
- Temperatura de creatividad: ${temperature}

EJEMPLOS DE BUENAS PERSONALIZACIONES:

Ejemplo 1 (Original: "Porque de tal manera amó Dios al mundo..." - Juan 3:16):
✅ BUENO: "Porque de tal manera te amó Dios a ti, María, que dio a su Hijo unigénito, para que creyendo en él, no perezcas, sino que tengas vida eterna."

Ejemplo 2 (Original: "Todo lo puedo en Cristo que me fortalece" - Filipenses 4:13):
✅ BUENO: "Recuerda Juan, que todo lo puedes en Cristo que te fortalece, Él es tu fuerza en cada desafío que enfrentas."

Ejemplo 3 (Original: "Jehová es mi pastor, nada me faltará" - Salmos 23:1):
✅ BUENO: "Jehová es tu pastor, Pedro, nada te faltará. Él cuida de ti con amor infinito."

EJEMPLOS DE MALAS PERSONALIZACIONES (EVITAR):

Ejemplo 1:
❌ MALO: "Hey María, Dios te ama un montón y quiere que seas feliz siempre, así que confía en Jesús y todo estará bien."
Razón: Demasiado informal, pierde el tono devocional, cambia completamente la estructura.

Ejemplo 2:
❌ MALO: "Juan, tú eres súper poderoso porque Cristo vive en ti, así que puedes conquistar el mundo y lograr todos tus sueños materiales."
Razón: Distorsiona el mensaje teológico, enfoque materialista, promesas no bíblicas.

Ejemplo 3:
❌ MALO: "Querido Pedro, así como Jehová fue pastor de David, ahora es tu pastor también, y esto significa que nunca tendrás problemas económicos ni de salud."
Razón: Añade interpretaciones no bíblicas, promesas de prosperidad no presentes en el texto original, excesivamente largo.

Responde SOLO con el versículo personalizado para ${userName}, sin explicaciones adicionales, sin comillas adicionales.`;
  }
}
