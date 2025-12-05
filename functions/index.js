/**
 * Cloud Functions para YourSwordsForMe
 * 
 * Implementa la generación segura de versículos personalizados
 * usando transacciones de Firestore para garantizar integridad.
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { defineSecret } = require("firebase-functions/params");
const OpenAI = require("openai");

// Inicializar Firebase Admin
initializeApp();
const db = getFirestore();

// Definir secretos (se configuran con: firebase functions:secrets:set OPENAI_API_KEY)
const openaiApiKey = defineSecret("OPENAI_API_KEY");

// Email con acceso ilimitado (sin consumo de tokens)
const UNLIMITED_ACCESS_EMAIL = "estebanicamp@gmail.com";

/**
 * Versículos populares como fallback (en español RVR1960)
 */
const popularVerses = {
  "Juan 3:16": {
    reference: "Juan 3:16",
    text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
    translation: "Reina Valera 1960",
  },
  "Juan 3:17": {
    reference: "Juan 3:17",
    text: "Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.",
    translation: "Reina Valera 1960",
  },
  "Juan 14:27": {
    reference: "Juan 14:27",
    text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.",
    translation: "Reina Valera 1960",
  },
  "Salmos 23:1": {
    reference: "Salmos 23:1",
    text: "Jehová es mi pastor; nada me faltará.",
    translation: "Reina Valera 1960",
  },
  "Salmos 23:1-6": {
    reference: "Salmos 23:1-6",
    text: "Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; Junto a aguas de reposo me pastoreará. Confortará mi alma; Me guiará por sendas de justicia por amor de su nombre. Aunque ande en valle de sombra de muerte, No temeré mal alguno, porque tú estarás conmigo; Tu vara y tu cayado me infundirán aliento. Aderezas mesa delante de mí en presencia de mis angustiadores; Unges mi cabeza con aceite; mi copa está rebosando. Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, Y en la casa de Jehová moraré por largos días.",
    translation: "Reina Valera 1960",
  },
  "Filipenses 4:13": {
    reference: "Filipenses 4:13",
    text: "Todo lo puedo en Cristo que me fortalece.",
    translation: "Reina Valera 1960",
  },
  "Jeremias 29:11": {
    reference: "Jeremías 29:11",
    text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
    translation: "Reina Valera 1960",
  },
  "Jeremías 29:11": {
    reference: "Jeremías 29:11",
    text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
    translation: "Reina Valera 1960",
  },
  "Proverbios 3:5-6": {
    reference: "Proverbios 3:5-6",
    text: "Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.",
    translation: "Reina Valera 1960",
  },
  "Romanos 8:28": {
    reference: "Romanos 8:28",
    text: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.",
    translation: "Reina Valera 1960",
  },
  "Isaías 41:10": {
    reference: "Isaías 41:10",
    text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.",
    translation: "Reina Valera 1960",
  },
  "Isaias 41:10": {
    reference: "Isaías 41:10",
    text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.",
    translation: "Reina Valera 1960",
  },
  "Mateo 11:28": {
    reference: "Mateo 11:28",
    text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
    translation: "Reina Valera 1960",
  },
  "Josue 1:9": {
    reference: "Josué 1:9",
    text: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.",
    translation: "Reina Valera 1960",
  },
  "Josué 1:9": {
    reference: "Josué 1:9",
    text: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.",
    translation: "Reina Valera 1960",
  },
};

/**
 * Normaliza una referencia bíblica para buscar en el cache
 */
const normalizeReference = (ref) => {
  return ref.trim()
    .replace(/\s+/g, " ")
    .replace(/(\d+)\s*:\s*(\d+)/g, "$1:$2");
};

/**
 * Verifica si el usuario tiene acceso ilimitado
 */
const hasUnlimitedAccess = (email) => {
  return email === UNLIMITED_ACCESS_EMAIL;
};

/**
 * Obtiene el texto del versículo desde la API de la Biblia o el cache local
 * @param {string} reference - Referencia bíblica (ej: "Juan 3:16")
 */
const fetchVerseFromAPI = async (reference) => {
  const normalizedRef = normalizeReference(reference);
  
  // 1. Primero buscar en el cache local de versículos populares
  if (popularVerses[normalizedRef]) {
    console.log(`Verse found in local cache: ${normalizedRef}`);
    return popularVerses[normalizedRef];
  }
  
  // 2. Intentar con bible-api.com (soporta español)
  const baseUrl = "https://bible-api.com";
  
  try {
    // Intentar con la referencia original
    const encodedRef = encodeURIComponent(normalizedRef);
    let response = await fetch(`${baseUrl}/${encodedRef}?translation=reina-valera-1960`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        return {
          text: data.text.trim(),
          reference: data.reference || normalizedRef,
          translation: data.translation_name || "Reina Valera 1960",
        };
      }
    }
    
    // Intentar sin especificar traducción
    response = await fetch(`${baseUrl}/${encodedRef}`);
    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        return {
          text: data.text.trim(),
          reference: data.reference || normalizedRef,
          translation: data.translation_name || "KJV",
        };
      }
    }
    
    // Si no se encontró, lanzar error con mensaje descriptivo
    throw new Error(`No se encontró el versículo: ${reference}`);
    
  } catch (error) {
    console.error("Error fetching verse:", error.message);
    
    // Como último recurso, buscar coincidencia parcial en cache
    const refLower = normalizedRef.toLowerCase();
    for (const [key, value] of Object.entries(popularVerses)) {
      if (key.toLowerCase().includes(refLower) || refLower.includes(key.toLowerCase())) {
        console.log(`Partial match found in cache: ${key}`);
        return value;
      }
    }
    
    throw new Error(`No se pudo obtener el versículo: ${reference}. Intenta con una referencia como "Juan 3:16" o "Salmos 23:1".`);
  }
};

/**
 * Genera un versículo personalizado usando OpenAI
 */
const generateWithOpenAI = async (apiKey, verseText, verseReference, userName, temperature) => {
  const openai = new OpenAI({ apiKey });

  const systemPrompt = `Eres un asistente espiritual cristiano especializado en personalizar versículos bíblicos.
Tu tarea es tomar un versículo de la Biblia y personalizarlo para que hable directamente a la persona,
manteniendo el mensaje y significado original pero haciéndolo más personal y relevante.

Reglas:
1. Mantén la esencia y mensaje del versículo original
2. Usa el nombre de la persona de forma natural
3. Adapta el lenguaje para que sea directo y personal
4. No cambies el significado teológico
5. Mantén un tono amoroso y esperanzador
6. Responde SOLO con el versículo personalizado, sin explicaciones adicionales`;

  const userPrompt = `Versículo original (${verseReference}):
"${verseText}"

Nombre de la persona: ${userName}

Por favor, personaliza este versículo para ${userName}, manteniendo su mensaje espiritual pero haciéndolo más directo y personal.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: temperature,
    max_tokens: 500,
  });

  return completion.choices[0].message.content.trim();
};

/**
 * Cloud Function: generateVerse
 * 
 * Función invocable que maneja todo el proceso de generación de versículos:
 * 1. Verifica autenticación
 * 2. Verifica tokens disponibles
 * 3. Obtiene el versículo de la API
 * 4. Genera versión personalizada con IA
 * 5. Usa transacción para: decrementar tokens + guardar versículo
 * 6. Retorna el resultado
 */
exports.generateVerse = onCall(
  {
    secrets: [openaiApiKey],
    cors: true,
    region: "us-central1",
  },
  async (request) => {
    // 1. Verificar autenticación
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Debes iniciar sesión para generar versículos."
      );
    }

    const userId = request.auth.uid;
    const { userName, verseReference, temperature = 0.5 } = request.data;

    // 2. Validar parámetros
    if (!userName || typeof userName !== "string" || userName.trim().length === 0) {
      throw new HttpsError(
        "invalid-argument",
        "El nombre de usuario es requerido."
      );
    }

    if (!verseReference || typeof verseReference !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "La referencia del versículo es requerida."
      );
    }

    if (typeof temperature !== "number" || temperature < 0 || temperature > 1) {
      throw new HttpsError(
        "invalid-argument",
        "La temperatura debe ser un número entre 0 y 1."
      );
    }

    try {
      // 3. Obtener datos del usuario
      const userRef = db.collection("users").doc(userId);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        throw new HttpsError(
          "not-found",
          "Usuario no encontrado. Por favor, vuelve a iniciar sesión."
        );
      }

      const userData = userSnap.data();
      const isUnlimited = hasUnlimitedAccess(userData.email);

      // 4. Verificar tokens (si no tiene acceso ilimitado)
      if (!isUnlimited && (!userData.tokens || userData.tokens <= 0)) {
        throw new HttpsError(
          "resource-exhausted",
          "No tienes tokens disponibles. Por favor, adquiere más tokens para continuar."
        );
      }

      // 5. Obtener versículo de la API de la Biblia
      console.log(`Fetching verse: ${verseReference}`);
      const verseData = await fetchVerseFromAPI(verseReference);

      // 6. Generar versículo personalizado con OpenAI
      console.log(`Generating personalized verse for: ${userName}`);
      const personalizedText = await generateWithOpenAI(
        openaiApiKey.value(),
        verseData.text,
        verseData.reference,
        userName.trim(),
        temperature
      );

      // 7. Usar transacción para actualizar tokens y guardar versículo
      const result = await db.runTransaction(async (transaction) => {
        // Re-leer el usuario dentro de la transacción para evitar race conditions
        const freshUserSnap = await transaction.get(userRef);
        const freshUserData = freshUserSnap.data();

        // Verificar tokens de nuevo (por si acaso)
        if (!isUnlimited && (!freshUserData.tokens || freshUserData.tokens <= 0)) {
          throw new HttpsError(
            "resource-exhausted",
            "No tienes tokens disponibles."
          );
        }

        // Crear referencia para el nuevo versículo
        const versesRef = userRef.collection("generated_verses");
        const newVerseRef = versesRef.doc();

        // Datos del versículo a guardar
        const verseDoc = {
          verseReference: verseData.reference,
          originalText: verseData.text,
          personalizedText: personalizedText,
          translation: verseData.translation,
          userName: userName.trim(),
          temperature: temperature,
          isFavorite: false,
          createdAt: FieldValue.serverTimestamp(),
        };

        // Guardar el versículo
        transaction.set(newVerseRef, verseDoc);

        // Actualizar estadísticas del usuario
        if (isUnlimited) {
          // Usuario ilimitado: solo incrementar contador
          transaction.update(userRef, {
            totalGenerated: FieldValue.increment(1),
            lastGeneratedAt: FieldValue.serverTimestamp(),
          });
        } else {
          // Usuario normal: decrementar token e incrementar contador
          transaction.update(userRef, {
            tokens: FieldValue.increment(-1),
            totalGenerated: FieldValue.increment(1),
            lastGeneratedAt: FieldValue.serverTimestamp(),
          });
        }

        return {
          verseId: newVerseRef.id,
          tokensRemaining: isUnlimited ? "unlimited" : freshUserData.tokens - 1,
        };
      });

      // 8. Retornar resultado exitoso
      console.log(`Verse generated successfully for user: ${userId}, verseId: ${result.verseId}`);
      return {
        success: true,
        data: {
          verseId: result.verseId,
          reference: verseData.reference,
          originalText: verseData.text,
          personalizedText: personalizedText,
          translation: verseData.translation,
          tokensRemaining: result.tokensRemaining,
        },
      };

    } catch (error) {
      console.error("Error in generateVerse:", error);

      // Si ya es un HttpsError, re-lanzarlo
      if (error instanceof HttpsError) {
        throw error;
      }

      // Manejar errores de OpenAI
      if (error.message?.includes("OpenAI") || error.code === "insufficient_quota") {
        throw new HttpsError(
          "internal",
          "Error al generar el versículo con IA. Por favor, intenta de nuevo."
        );
      }

      // Error genérico
      throw new HttpsError(
        "internal",
        "Error al procesar tu solicitud. Por favor, intenta de nuevo."
      );
    }
  }
);

/**
 * Cloud Function: getTokensRemaining
 * 
 * Función auxiliar para obtener los tokens restantes del usuario
 */
exports.getTokensRemaining = onCall(
  {
    cors: true,
    region: "us-central1",
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Debes iniciar sesión.");
    }

    const userId = request.auth.uid;
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new HttpsError("not-found", "Usuario no encontrado.");
    }

    const userData = userSnap.data();
    const isUnlimited = hasUnlimitedAccess(userData.email);

    return {
      tokens: isUnlimited ? "unlimited" : userData.tokens || 0,
      totalGenerated: userData.totalGenerated || 0,
      isUnlimited: isUnlimited,
    };
  }
);
