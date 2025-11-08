/**
 * Versículos populares como fallback
 */
const popularVerses = {
  'Juan 3:16': {
    reference: 'Juan 3:16',
    text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Juan 3:17': {
    reference: 'Juan 3:17',
    text: 'Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Juan 14:27': {
    reference: 'Juan 14:27',
    text: 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Salmos 23:1': {
    reference: 'Salmos 23:1',
    text: 'Jehová es mi pastor; nada me faltará.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Filipenses 4:13': {
    reference: 'Filipenses 4:13',
    text: 'Todo lo puedo en Cristo que me fortalece.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Jeremias 29:11': {
    reference: 'Jeremias 29:11',
    text: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Proverbios 3:5-6': {
    reference: 'Proverbios 3:5-6',
    text: 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Romanos 8:28': {
    reference: 'Romanos 8:28',
    text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Isaías 41:10': {
    reference: 'Isaías 41:10',
    text: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  },
  'Mateo 11:28': {
    reference: 'Mateo 11:28',
    text: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
    translation_id: 'rvr1960',
    translation_name: 'Reina Valera 1960'
  }
};

/**
 * Mapeo de nombres de libros en español a IDs de api.bible
 */
const bookNameMap = {
  // Antiguo Testamento
  'genesis': 'GEN', 'génesis': 'GEN',
  'exodo': 'EXO', 'éxodo': 'EXO',
  'levitico': 'LEV', 'levítico': 'LEV',
  'numeros': 'NUM', 'números': 'NUM',
  'deuteronomio': 'DEU',
  'josue': 'JOS', 'josué': 'JOS',
  'jueces': 'JDG',
  'rut': 'RUT', 'ruth': 'RUT',
  '1samuel': '1SA', '1 samuel': '1SA',
  '2samuel': '2SA', '2 samuel': '2SA',
  '1reyes': '1KI', '1 reyes': '1KI',
  '2reyes': '2KI', '2 reyes': '2KI',
  '1cronicas': '1CH', '1 crónicas': '1CH', '1 cronicas': '1CH',
  '2cronicas': '2CH', '2 crónicas': '2CH', '2 cronicas': '2CH',
  'esdras': 'EZR',
  'nehemias': 'NEH', 'nehemías': 'NEH',
  'ester': 'EST',
  'job': 'JOB',
  'salmos': 'PSA', 'salmo': 'PSA',
  'proverbios': 'PRO',
  'eclesiastes': 'ECC', 'ecclesiastés': 'ECC',
  'cantares': 'SNG', 'cantar de los cantares': 'SNG',
  'isaias': 'ISA', 'isaías': 'ISA',
  'jeremias': 'JER', 'jeremías': 'JER',
  'lamentaciones': 'LAM',
  'ezequiel': 'EZK',
  'daniel': 'DAN',
  'oseas': 'HOS',
  'joel': 'JOL',
  'amos': 'AMO', 'amós': 'AMO',
  'abdias': 'OBA', 'abdías': 'OBA',
  'jonas': 'JON', 'jonás': 'JON',
  'miqueas': 'MIC',
  'nahum': 'NAM',
  'habacuc': 'HAB',
  'sofonias': 'ZEP', 'sofonías': 'ZEP',
  'hageo': 'HAG',
  'zacarias': 'ZEC', 'zacarías': 'ZEC',
  'malaquias': 'MAL', 'malaquías': 'MAL',
  // Nuevo Testamento
  'mateo': 'MAT',
  'marcos': 'MRK',
  'lucas': 'LUK',
  'juan': 'JHN',
  'hechos': 'ACT',
  'romanos': 'ROM',
  '1corintios': '1CO', '1 corintios': '1CO',
  '2corintios': '2CO', '2 corintios': '2CO',
  'galatas': 'GAL', 'gálatas': 'GAL',
  'efesios': 'EPH',
  'filipenses': 'PHP',
  'colosenses': 'COL',
  '1tesalonicenses': '1TH', '1 tesalonicenses': '1TH',
  '2tesalonicenses': '2TH', '2 tesalonicenses': '2TH',
  '1timoteo': '1TI', '1 timoteo': '1TI',
  '2timoteo': '2TI', '2 timoteo': '2TI',
  'tito': 'TIT',
  'filemon': 'PHM', 'filemón': 'PHM',
  'hebreos': 'HEB',
  'santiago': 'JAS',
  '1pedro': '1PE', '1 pedro': '1PE',
  '2pedro': '2PE', '2 pedro': '2PE',
  '1juan': '1JN', '1 juan': '1JN',
  '2juan': '2JN', '2 juan': '2JN',
  '3juan': '3JN', '3 juan': '3JN',
  'judas': 'JUD',
  'apocalipsis': 'REV'
};

/**
 * Convertir referencia en español a formato api.bible
 * Ejemplo: "Juan 3:16" -> "JHN.3.16"
 */
const convertToApiBibleFormat = (reference) => {
  const match = reference.match(/^([1-3]?\s*[A-Za-zá-úÁ-Ú]+)\s+(\d+):(\d+)(-(\d+))?/i);
  if (!match) return null;

  const bookName = match[1].toLowerCase().trim().replace(/\s+/g, '');
  const chapter = match[2];
  const verseStart = match[3];
  const verseEnd = match[5];

  const bookId = bookNameMap[bookName];
  if (!bookId) return null;

  if (verseEnd) {
    return `${bookId}.${chapter}.${verseStart}-${bookId}.${chapter}.${verseEnd}`;
  }
  return `${bookId}.${chapter}.${verseStart}`;
};

/**
 * Obtener versículo de la Bible API oficial (api.bible)
 */
export const fetchVerse = async (reference) => {
  const apiKey = import.meta.env.VITE_BIBLE_API_KEY;
  const translationId = import.meta.env.VITE_BIBLE_TRANSLATION_ID || '592420522e16049f-01'; // Reina Valera 1909 por defecto

  try {
    // Validar que existe la API key
    if (!apiKey) {
      console.warn('Bible API key no configurada, usando fallback local');
      return getFallbackVerse(reference);
    }

    // Convertir referencia al formato de api.bible
    const verseId = convertToApiBibleFormat(reference.trim());
    if (!verseId) {
      throw new Error('Formato de referencia inválido');
    }

    console.log(`Buscando versículo: ${reference} (${verseId}) en traducción ${translationId}`);

    // Llamar a la API oficial de Bible
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${translationId}/passages/${verseId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false`,
      {
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Error en Bible API:', response.status, errorData);
      throw new Error(`Bible API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.content) {
      return {
        reference: data.data.reference || reference,
        text: data.data.content.trim(),
        translation_id: translationId,
        translation_name: getTranslationName(translationId)
      };
    }

    throw new Error('Versículo no encontrado en la API');
    
  } catch (error) {
    console.warn('Error en Bible API, usando fallback local:', error);
    return getFallbackVerse(reference);
  }
};

/**
 * Obtener versículo del fallback local
 */
const getFallbackVerse = (reference) => {
  const normalizedRef = normalizeReference(reference);
  for (const [key, verse] of Object.entries(popularVerses)) {
    if (normalizeReference(key) === normalizedRef) {
      return verse;
    }
  }
  throw new Error('Versículo no encontrado. Por favor verifica la referencia o intenta con uno de los versículos populares.');
};

/**
 * Obtener nombre de la traducción
 */
const getTranslationName = (translationId) => {
  const translations = {
    '592420522e16049f-01': 'Reina Valera 1909',
    '6b7f504f1b6050c1-01': 'Biblica Open Nueva Biblia Viva 2008',
    '48acedcf8595c754-01': 'Palabla de Dios para ti',
    '48acedcf8595c754-02': 'Palabla de Dios para ti (NT+PP)',
    'b32b9d1b64b4ef29-01': 'The Holy Bible in Simple Spanish',
    '482ddd53705278cc-01': 'Free Bible Version (NT)',
    '482ddd53705278cc-02': 'Versión Biblia Libre'
  };
  return translations[translationId] || 'Versión en Español';
};

/**
 * Normalizar referencia para comparación
 */
const normalizeReference = (ref) => {
  return ref
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u');
};

/**
 * Validar formato de referencia bíblica
 */
export const validateReference = (reference) => {
  // Regex básico para validar formato
  const pattern = /^[1-3]?\s*[A-Za-zá-úÁ-Ú]+\s+\d+:\d+[a-z]?(-\d+[a-z]?)?$/;
  return pattern.test(reference.trim());
};

/**
 * Obtener versículos populares
 */
export const getPopularVerses = () => {
  return Object.keys(popularVerses);
};
