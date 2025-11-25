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

Responde SOLO con el versículo personalizado, sin explicaciones adicionales, sin comillas adicionales.`;
  }