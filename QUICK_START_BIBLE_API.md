# ⚡ Inicio Rápido: Bible API

## 🎯 Qué Cambió

Tu app ahora usa **scripture.api.bible** (la API oficial) en lugar de bible-api.com.

**Ventajas:**
- ✅ 7 traducciones en español (antes: 0)
- ✅ Reina Valera 1909 disponible
- ✅ 5,000 requests GRATIS por día
- ✅ API oficial y estable

## 🚀 3 Pasos para Configurar (5 minutos)

### 1️⃣ Obtener Bible API Key (GRATIS)

**Página:** https://scripture.api.bible/signup

1. Haz clic en "Sign Up"
2. Ingresa tu email y crea una contraseña
3. Confirma tu email
4. Ve a: https://scripture.api.bible/admin/applications
5. **Copia tu API Key** (empieza con letras y números)

⏱️ **Tiempo:** 2 minutos

---

### 2️⃣ Crear archivo `.env`

En la **raíz del proyecto** (donde está `package.json`), crea un archivo llamado `.env`:

**Contenido mínimo:**
```env
VITE_BIBLE_API_KEY=pega_tu_api_key_aqui
VITE_BIBLE_TRANSLATION_ID=592420522e16049f-01
```

**Ejemplo completo:**
```env
# Firebase (ya deberías tenerlo)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=yourswordsforme.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourswordsforme
VITE_FIREBASE_STORAGE_BUCKET=yourswordsforme.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# OpenAI (ya deberías tenerlo)
VITE_OPENAI_API_KEY=sk-...

# Bible API (NUEVO - agrega esto)
VITE_BIBLE_API_KEY=tu_api_key_de_scripture_api_bible
VITE_BIBLE_TRANSLATION_ID=592420522e16049f-01
```

⏱️ **Tiempo:** 1 minuto

---

### 3️⃣ Reiniciar el Servidor

Si el servidor está corriendo, **detenerlo** (Ctrl+C) y volver a ejecutar:

```powershell
npm run dev
```

⏱️ **Tiempo:** 30 segundos

---

## ✅ Verificar que Funciona

### 1. Abre la app en el navegador
```
http://localhost:3000
```

### 2. Inicia sesión con Google

### 3. Prueba con un versículo
Ingresa: **Juan 3:16**

### 4. Abre la consola del navegador (F12)
Deberías ver:
```
✅ Buscando versículo: Juan 3:16 (JHN.3.16) en traducción 592420522e16049f-01
```

### 5. El versículo debe aparecer en español
```
"Porque de tal manera amó Dios al mundo, que dió a su Hijo unigénito..."
```

**Traducción mostrada:** Reina Valera 1909

---

## 🎨 Traducciones Disponibles

Puedes cambiar `VITE_BIBLE_TRANSLATION_ID` en el `.env`:

| Traducción | ID | Uso |
|------------|----|----|
| **Reina Valera 1909** | `592420522e16049f-01` | ⭐ Recomendado (clásica) |
| Nueva Biblia Viva 2008 | `6b7f504f1b6050c1-01` | Lenguaje moderno |
| Palabla de Dios para ti | `48acedcf8595c754-01` | Biblia completa |
| Versión Biblia Libre | `482ddd53705278cc-02` | Traducción libre |

---

## 🐛 Solución de Problemas

### ❌ No aparece el versículo
**Causa:** API key no configurada o incorrecta

**Solución:**
1. Verifica que el archivo `.env` exista en la raíz del proyecto
2. Verifica que `VITE_BIBLE_API_KEY` tenga tu API key correcta
3. Reinicia el servidor: `npm run dev`

---

### ❌ Consola muestra: "Bible API key no configurada"
**Causa:** Variable de entorno no encontrada

**Solución:**
1. El archivo `.env` debe estar en la **raíz** (no en `src/`)
2. La variable debe empezar con `VITE_` (Vite lo requiere)
3. Reinicia el servidor después de crear `.env`

---

### ❌ Error 401: Unauthorized
**Causa:** API key inválida

**Solución:**
1. Verifica que copiaste la API key completa (sin espacios)
2. Genera una nueva API key en: https://scripture.api.bible/admin/applications
3. Reemplázala en `.env`
4. Reinicia el servidor

---

### ❌ Aparece en inglés en vez de español
**Causa:** Traducción incorrecta configurada

**Solución:**
```env
# Asegúrate de usar una traducción en español
VITE_BIBLE_TRANSLATION_ID=592420522e16049f-01
```

---

## 📊 Límites de la API

**Plan Gratuito:**
- ✅ 5,000 requests por día
- ✅ 208 requests por hora
- ✅ Sin tarjeta de crédito requerida

**Para tu app:**
- 1 versículo generado = 1 request
- 5,000 versículos al día es **MÁS que suficiente**

---

## 🎯 Versículos Garantizados (sin API)

Estos versículos **siempre funcionan** (incluso sin API key):

1. Juan 3:16
2. Juan 3:17
3. Juan 14:27
4. Salmos 23:1
5. Filipenses 4:13
6. Jeremías 29:11
7. Proverbios 3:5-6
8. Romanos 8:28
9. Isaías 41:10
10. Mateo 11:28

---

## 📚 Más Información

- **Guía completa:** [BIBLE_API_GUIDE.md](./BIBLE_API_GUIDE.md)
- **Documentación oficial:** https://docs.api.bible/
- **Probar API (Live Docs):** https://scripture.api.bible/livedocs
- **Soporte:** support@api.bible

---

## ✅ Resumen

1. ✅ Obtén Bible API Key (gratis): https://scripture.api.bible/signup
2. ✅ Crea `.env` con `VITE_BIBLE_API_KEY`
3. ✅ Reinicia servidor: `npm run dev`
4. ✅ Prueba con: Juan 3:16
5. ✅ ¡Listo! 🎉

**Tiempo total:** 5 minutos

---

**¿Necesitas ayuda?** Revisa [BIBLE_API_GUIDE.md](./BIBLE_API_GUIDE.md) para más detalles.
