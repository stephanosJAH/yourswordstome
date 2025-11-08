# YourWordsForMe - Guía de Configuración

## Configuración Inicial

### 1. Instalar Dependencias

```powershell
npm install
```

### 2. Configurar Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar **Authentication** con proveedor de Google
3. Crear base de datos **Cloud Firestore** (modo producción)
4. Copiar la configuración del proyecto

### 3. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# OpenAI API Key
VITE_OPENAI_API_KEY=sk-...

# Bible API Configuration (scripture.api.bible)
VITE_BIBLE_API_KEY=tu_bible_api_key_aqui
VITE_BIBLE_TRANSLATION_ID=592420522e16049f-01
```

**📖 Bible API (NUEVO):**
- Regístrate gratis en: https://scripture.api.bible/signup
- Obtén tu API Key en: https://scripture.api.bible/admin/applications
- Ver guía completa: [BIBLE_API_GUIDE.md](./BIBLE_API_GUIDE.md)
- Límite gratuito: 5,000 requests/día

### 4. Configurar Firestore Security Rules

Desde Firebase Console → Firestore Database → Rules, publica las reglas del archivo `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

O copia manualmente el contenido del archivo a la consola.

### 5. Configurar Dominios Autorizados

En Firebase Console → Authentication → Settings → Authorized domains:
- Agregar `localhost` (ya incluido)
- Agregar tu dominio de producción (ej: `yourswordsforme.vercel.app`)

## Desarrollo

```powershell
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Configuración de IA

### OpenAI (ChatGPT)

1. Obtener API key de [OpenAI Platform](https://platform.openai.com/api-keys)
2. Agregar a `.env` como `VITE_OPENAI_API_KEY`
3. O permitir que usuarios ingresen su propia API key en la app

**Costo estimado**: ~$0.002 por generación con GPT-4

### Claude (Opcional - Futuro)

1. Obtener API key de [Anthropic Console](https://console.anthropic.com/)
2. Agregar como `VITE_CLAUDE_API_KEY`
3. Cambiar proveedor en `verseGeneratorService.js`

## Estructura de Archivos Clave

```
src/
├── config/
│   └── firebase.js           # Configuración de Firebase
├── contexts/
│   └── AuthContext.jsx       # Contexto de autenticación
├── services/
│   ├── ai/                   # Servicios de IA (OpenAI, Claude)
│   ├── authService.js        # Autenticación
│   ├── userService.js        # Gestión de usuarios
│   ├── bibleService.js       # Bible API
│   └── verseGeneratorService.js  # Servicio principal
├── pages/
│   ├── LandingPage.jsx       # Landing page
│   ├── Dashboard.jsx         # Dashboard principal
│   └── ResultPage.jsx        # Página de resultados
└── components/
    └── visual/               # Componentes de estilos visuales
```

## Deployment

### Vercel (Recomendado)

1. Instalar Vercel CLI:
```powershell
npm i -g vercel
```

2. Deploy:
```powershell
npm run build
vercel --prod
```

3. Configurar variables de entorno en Vercel Dashboard

### Firebase Hosting (Alternativa)

1. Instalar Firebase CLI:
```powershell
npm i -g firebase-tools
```

2. Login y deploy:
```powershell
firebase login
npm run build
firebase deploy --only hosting
```

## Solución de Problemas Comunes

### Error: "Firebase configuration not found"
- Verificar que el archivo `.env` exista y tenga todas las variables
- Reiniciar el servidor de desarrollo

### Error: "Insufficient permissions"
- Verificar que las reglas de Firestore estén publicadas correctamente
- Verificar que el usuario esté autenticado

### Error: "OpenAI API key invalid"
- Verificar que la API key sea válida y tenga créditos
- Verificar que la variable de entorno esté correctamente configurada

### Error al generar imagen con html2canvas
- Verificar que las imágenes tengan CORS habilitado
- Usar imágenes desde Unsplash API o similar con CORS

## Configuración de Proveedores de IA

### Cambiar entre OpenAI y Claude

En `src/services/verseGeneratorService.js`:

```javascript
// Para OpenAI
const service = new VerseGeneratorService('openai', 'tu-api-key');

// Para Claude
const service = new VerseGeneratorService('claude', 'tu-api-key');
```

### Agregar Nuevo Proveedor

1. Crear clase en `src/services/ai/` que extienda `AIProvider`
2. Implementar método `generatePersonalizedVerse()`
3. Registrar en `AIProviderFactory.js`

## Testing

```powershell
# Verificar que todas las dependencias estén instaladas
npm list

# Verificar configuración de Firebase
npm run dev
# Intentar login con Google
```

## Monitoreo

### Firebase Console
- **Authentication**: Verificar usuarios registrados
- **Firestore**: Verificar documentos de usuarios y tokens
- **Usage**: Monitorear lectura/escritura

### OpenAI Dashboard
- Verificar uso de API y costos
- Configurar límites de uso

## Próximos Pasos

1. ✅ Configurar proyecto
2. ✅ Implementar autenticación
3. ✅ Integrar IA
4. ⏳ Testing completo
5. ⏳ Deploy a producción
6. ⏳ Configurar analytics
7. ⏳ Implementar monetización (Fase 4)
