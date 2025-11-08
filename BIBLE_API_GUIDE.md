# 📖 Guía de Configuración: Bible API

## 🎯 ¿Por qué api.bible?

La API oficial de **scripture.api.bible** ofrece:

- ✅ **7 traducciones en español** disponibles
- ✅ **Reina Valera 1909** (dominio público)
- ✅ **Gratis** hasta 5,000 requests/día
- ✅ **Oficial y confiable**
- ✅ **Documentación completa**
- ✅ **Sin problemas de traducciones**

## 🚀 Paso 1: Obtener API Key (GRATIS)

1. Ve a: **https://scripture.api.bible/signup**
2. Regístrate con tu email
3. Confirma tu cuenta
4. Ve a: **https://scripture.api.bible/admin/applications**
5. Copia tu **API Key**

⏱️ Tiempo estimado: **2 minutos**

## 🔧 Paso 2: Configurar Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto:

```bash
# Bible API Configuration
VITE_BIBLE_API_KEY=tu_api_key_aqui_desde_scripture_api_bible

# Traducción por defecto (Reina Valera 1909)
VITE_BIBLE_TRANSLATION_ID=592420522e16049f-01
```

### 📚 Traducciones Disponibles en Español

Puedes cambiar `VITE_BIBLE_TRANSLATION_ID` a cualquiera de estas:

| Traducción | ID | Descripción |
|------------|----|-----------  |
| **Reina Valera 1909** | `592420522e16049f-01` | 📖 Clásica, dominio público |
| Nueva Biblia Viva 2008 | `6b7f504f1b6050c1-01` | 📖 Moderna, lenguaje actual |
| Palabla de Dios para ti | `48acedcf8595c754-01` | 📖 Biblia completa |
| Versión Biblia Libre | `482ddd53705278cc-02` | 📖 Traducción libre |
| Simple Spanish | `b32b9d1b64b4ef29-01` | 📖 Español simplificado |

**Recomendado:** Reina Valera 1909 (es la más cercana a RVR1960)

## 🧪 Paso 3: Verificar Configuración

1. **Reinicia el servidor de desarrollo:**
   ```powershell
   npm run dev
   ```

2. **Prueba con un versículo:**
   - Ingresa: `Juan 3:16`
   - Debe aparecer en español (Reina Valera 1909)

3. **Revisa la consola del navegador (F12):**
   ```
   ✅ Buscando versículo: Juan 3:16 (JHN.3.16) en traducción 592420522e16049f-01
   ```

## 📊 Límites de la API (Plan Gratuito)

- ✅ **5,000 requests por día**
- ✅ **208 requests por hora**
- ✅ **Sin tarjeta de crédito requerida**

Para tu app:
- 1 versículo = 1 request
- **5,000 versículos al día es MÁS que suficiente**

## 🔄 Cómo Funciona Ahora

### 1. **Con API Key Configurada:**
```javascript
Usuario ingresa: "Juan 3:16"
→ Convierte a formato api.bible: "JHN.3.16"
→ Llama a: https://api.scripture.api.bible/v1/bibles/592420522e16049f-01/passages/JHN.3.16
→ Respuesta: "Porque de tal manera amó Dios al mundo..." (RV1909) ✅
```

### 2. **Sin API Key (Fallback Local):**
```javascript
Usuario ingresa: "Juan 3:16"
→ No hay API key
→ Busca en fallback local
→ Respuesta: Versículo desde popularVerses (RVR1960) ✅
```

### 3. **Versículo No Encontrado:**
```javascript
Usuario ingresa: "Genesis 999:999"
→ API responde: 404 Not Found
→ Busca en fallback local
→ No existe en popularVerses
→ Error: "Versículo no encontrado..." ❌
```

## 🌍 Mapeo de Referencias

El servicio convierte automáticamente nombres en español:

| Español | Inglés | Código |
|---------|--------|--------|
| Juan 3:16 | John 3:16 | JHN.3.16 |
| Génesis 1:1 | Genesis 1:1 | GEN.1.1 |
| Salmos 23:1 | Psalm 23:1 | PSA.23.1 |
| 1 Corintios 13:4 | 1 Corinthians 13:4 | 1CO.13.4 |
| Apocalipsis 21:4 | Revelation 21:4 | REV.21.4 |

**Soporta:**
- ✅ Todos los 66 libros de la Biblia
- ✅ Nombres con acentos (Génesis, Éxodo)
- ✅ Nombres con números (1 Juan, 2 Pedro)
- ✅ Rangos de versículos (Juan 3:16-17)

## 🔍 Estructura de Respuesta

```javascript
{
  reference: "Juan 3:16",
  text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito...",
  translation_id: "592420522e16049f-01",
  translation_name: "Reina Valera 1909"
}
```

## 🐛 Solución de Problemas

### Error: "Bible API key no configurada"
**Causa:** No existe el archivo `.env` o falta la variable `VITE_BIBLE_API_KEY`

**Solución:**
```bash
# Crea .env en la raíz del proyecto
VITE_BIBLE_API_KEY=tu_api_key_aqui
```

### Error: "Formato de referencia inválido"
**Causa:** La referencia no coincide con el patrón esperado

**Solución:** Usa el formato: `Libro Capítulo:Versículo`
```
✅ Juan 3:16
✅ Génesis 1:1
✅ 1 Corintios 13:4-7
❌ Juan 3
❌ Juan3:16
```

### Error: "Bible API error: 401"
**Causa:** API key inválida o no autorizada

**Solución:**
1. Verifica que copiaste la API key completa
2. Reinicia el servidor: `npm run dev`
3. Si persiste, genera una nueva API key en https://scripture.api.bible/admin/applications

### Error: "Bible API error: 404"
**Causa:** El versículo no existe en esa traducción

**Solución:** 
- Verifica la referencia
- El sistema automáticamente usa el fallback local
- Intenta con versículos garantizados (ver Dashboard)

## 📈 Ventajas vs Bible API Anterior

| Aspecto | bible-api.com (anterior) | scripture.api.bible (nuevo) |
|---------|--------------------------|----------------------------|
| Traducciones español | ❌ Ninguna oficial | ✅ 7 traducciones |
| Reina Valera | ❌ No disponible | ✅ RV1909 disponible |
| Estabilidad | ⚠️ No oficial | ✅ API oficial |
| Límite | ⚠️ Sin garantía | ✅ 5,000/día garantizado |
| Soporte | ❌ Comunidad | ✅ Soporte oficial |
| Documentación | ⚠️ Básica | ✅ Completa |
| Costo | Gratis | Gratis |

## 🎯 Próximos Pasos

1. **Obtén tu API key** (2 minutos)
2. **Configura `.env`** (1 minuto)
3. **Reinicia el servidor** (`npm run dev`)
4. **Prueba con Juan 3:16** 
5. **¡Listo!** 🎉

## 📚 Recursos

- 📖 **Documentación oficial:** https://docs.api.bible/
- 🔑 **Obtener API key:** https://scripture.api.bible/signup
- 🧪 **Probar API (Live Docs):** https://scripture.api.bible/livedocs
- 💬 **Soporte:** support@api.bible

---

**Implementado:** 8 de noviembre de 2025  
**Archivo modificado:** `src/services/bibleService.js`  
**Nueva dependencia:** Bible API Key (gratis)
