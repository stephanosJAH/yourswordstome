# Documento Funcional - App de Versículos Bíblicos Personalizados

## 1. Resumen Ejecutivo

### 1.1 Descripción del Proyecto
Aplicación web (SPA) y móvil que permite a los usuarios generar versículos bíblicos personalizados utilizando Inteligencia Artificial. La personalización adapta el mensaje del versículo incorporando el nombre del usuario de manera natural y contextual.

### 1.2 Objetivo Principal
Crear una experiencia espiritual personalizada que permita a los usuarios conectar con mensajes bíblicos de manera más íntima y significativa, con capacidad de compartir estos mensajes visualmente atractivos.

### 1.3 Propuesta de Valor
- Personalización de versículos mediante IA
- Control creativo (temperatura de interpretación)
- Diseños visuales atractivos para compartir
- Sistema freemium (5 generaciones gratuitas)
- Multiplataforma (web + móvil)

---

## 2. Stack Tecnológico

### 2.1 Frontend Web
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **Estado**: React Hooks (useState, useContext)
- **Iconos**: Lucide React
- **Generación de Imágenes**: html2canvas
- **Routing**: React Router v6
- **HTTP Client**: Fetch API / Axios

### 2.2 Frontend Móvil (Fase 2)
- **Framework**: React Native
- **Navegación**: React Navigation
- **Compartir**: React Native Share
- **Auth**: Firebase Auth SDK

### 2.3 Backend & Servicios
- **Autenticación**: Firebase Authentication
- **Base de Datos**: Cloud Firestore
- **Storage**: Firebase Storage (para imágenes generadas)
- **IA**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Versículos**: Bible API (bible-api.com) o JSON local

### 2.4 Infraestructura
- **Hosting Web**: Vercel
- **Backend Functions**: Firebase Cloud Functions (Node.js)
- **CDN**: Vercel Edge Network
- **Dominio**: Custom domain (opcional)

---

## 3. Arquitectura del Sistema

### 3.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐   │
│  │  Login   │  │  Input   │  │  Visualización │   │
│  │Component │  │Component │  │   Component    │   │
│  └──────────┘  └──────────┘  └────────────────┘   │
└───────────────────┬─────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
┌────────▼─────────┐  ┌────────▼──────────┐
│  Firebase Auth   │  │ Firebase Firestore│
│  (Google Login)  │  │  (User Data/      │
│                  │  │   Tokens)         │
└──────────────────┘  └───────────────────┘
         │                     │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │ Cloud Functions     │
         │  - verifyTokens()   │
         │  - generateVerse()  │
         │  - decrementToken() │
         └──────────┬──────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
┌────────▼─────────┐  ┌────────▼─────────┐
│   Claude API     │  │   Bible API      │
│ (Personalización)│  │ (Obtener texto)  │
└──────────────────┘  └──────────────────┘
```

### 3.2 Flujo de Datos

**Flujo Principal de Uso:**

1. Usuario hace login con Google → Firebase Auth
2. Frontend obtiene datos del usuario (uid, nombre, email)
3. Firestore verifica/crea documento del usuario con tokens iniciales (5)
4. Usuario ingresa referencia bíblica (ej: "Juan 14:27b")
5. Frontend consulta Bible API para obtener texto original
6. Usuario ajusta temperatura (0-1) y presiona "Generar"
7. Frontend llama Cloud Function `generateVerse()`
8. Cloud Function:
   - Verifica tokens disponibles
   - Llama a Claude API con prompt estructurado
   - Decrementa tokens del usuario
   - Retorna versículo personalizado
9. Frontend muestra resultado con opciones de estilo
10. Usuario selecciona estilo y descarga/comparte imagen

---

## 4. Especificaciones Funcionales

### 4.1 Módulo de Autenticación

#### F1.1: Login con Google
- **Descripción**: Autenticación mediante cuenta Google
- **Prioridad**: Alta (MVP)
- **Inputs**: Click en botón "Continuar con Google"
- **Outputs**: 
  - Token de sesión
  - Datos básicos: uid, displayName, email, photoURL
- **Reglas de Negocio**:
  - Primer login crea documento en Firestore con 5 tokens
  - Usuarios existentes cargan tokens disponibles
  - Sesión persiste por 30 días

#### F1.2: Logout
- **Descripción**: Cerrar sesión del usuario
- **Prioridad**: Media
- **Acción**: Limpiar Firebase session y redirigir a landing

### 4.2 Módulo de Input de Versículos

#### F2.1: Input de Referencia Bíblica
- **Descripción**: Campo para ingresar referencia (ej: "Juan 14:27b")
- **Prioridad**: Alta (MVP)
- **Formato Aceptado**: 
  - `[Libro] [Capítulo]:[Versículo]`
  - `[Libro] [Capítulo]:[Versículo][letra]` (para subversículos)
  - Ejemplos: "Juan 3:16", "Salmos 23:1-3", "Romanos 8:28a"
- **Validación**:
  - Regex para validar formato
  - Consulta a Bible API para verificar existencia
  - Mensaje de error si no existe
- **Funcionalidad Adicional**:
  - Autocompletado de libros bíblicos (opcional Fase 2)
  - Sugerencias de versículos populares

#### F2.2: Input de Nombre (Alternativa)
- **Descripción**: Si no hay login, permitir input manual de nombre
- **Prioridad**: Baja (post-MVP)
- **Uso**: Para testing sin autenticación
- **Limitación**: Sin persistencia de tokens

#### F2.3: Control de Temperatura
- **Descripción**: Slider para ajustar creatividad de IA
- **Prioridad**: Alta (MVP)
- **Rango**: 0.0 a 1.0
- **Valores Predefinidos**:
  - 0.0-0.3: "Literal" (más cercano al texto original)
  - 0.4-0.6: "Balanceado" (recomendado)
  - 0.7-1.0: "Creativo" (interpretación más libre)
- **UI**: Slider con labels descriptivos
- **Default**: 0.5

### 4.3 Módulo de Generación con IA

#### F3.1: Obtención de Texto Original
- **Descripción**: Llamada a Bible API para obtener versículo
- **Prioridad**: Alta (MVP)
- **API Endpoint**: `https://bible-api.com/[referencia]?translation=rvr1960`
- **Response Esperado**:
```json
{
  "reference": "Juan 14:27",
  "text": "La paz os dejo, mi paz os doy...",
  "translation_id": "rvr1960",
  "translation_name": "Reina Valera 1960"
}
```
- **Manejo de Errores**:
  - 404: Versículo no encontrado
  - Timeout: Reintentar 2 veces
  - Fallback: JSON local de versículos comunes

#### F3.2: Personalización con Claude API
- **Descripción**: Generar versión personalizada del versículo
- **Prioridad**: Alta (MVP)
- **Endpoint**: Cloud Function `generateVerse()`
- **Input Parameters**:
```javascript
{
  "userId": "firebase_uid",
  "userName": "Esteban",
  "verseReference": "Juan 14:27b",
  "verseText": "No se turbe vuestro corazón...",
  "temperature": 0.5
}
```
- **Prompt Template para Claude**:
```
Eres un teólogo experto en personalizar mensajes bíblicos.

Versículo original: "[verseText]"
Referencia: [verseReference]

Tarea: Personaliza este versículo para [userName], manteniendo el mensaje espiritual y la esencia del texto. Incorpora el nombre de manera natural.

Reglas:
- Mantén el tono devocional y respetuoso
- El mensaje debe ser claro y edificante
- Longitud similar al original
- No inventes doctrinas
- Temperatura de creatividad: [temperature]

Responde SOLO con el versículo personalizado, sin explicaciones adicionales.
```

- **Output Esperado**:
```json
{
  "success": true,
  "personalizedVerse": "Esteban, que no se turbe tu corazón ni tengas miedo. Te dejo mi paz.",
  "tokensRemaining": 4,
  "timestamp": "2025-11-08T10:30:00Z"
}
```

- **Manejo de Errores**:
  - Tokens insuficientes: `{success: false, error: "insufficient_tokens"}`
  - Error de API: Mensaje amigable + retry
  - Rate limit: Espera y reintentar

#### F3.3: Gestión de Tokens
- **Descripción**: Sistema de créditos gratuitos
- **Prioridad**: Alta (MVP)
- **Modelo**:
  - Usuarios nuevos: 5 tokens gratuitos
  - 1 generación = 1 token
  - Tokens no se renuevan automáticamente en MVP
- **Firestore Schema**:
```javascript
users/{userId}: {
  displayName: "Esteban García",
  email: "esteban@email.com",
  photoURL: "https://...",
  tokens: 5,
  totalGenerated: 0,
  createdAt: timestamp,
  lastGeneratedAt: timestamp
}
```

- **Validación**:
  - Verificar tokens > 0 antes de generar
  - Decrementar atómicamente (transaction)
  - UI muestra tokens restantes siempre visible

### 4.4 Módulo de Visualización

#### F4.1: Selección de Estilo Visual
- **Descripción**: 3 plantillas prediseñadas para mostrar el versículo
- **Prioridad**: Alta (MVP)
- **Estilos Disponibles**:

**Estilo 1: "Clásico"**
- Fondo: Gradiente suave (beige → dorado)
- Tipografía: Serif elegante (Playfair Display)
- Layout: Centrado, texto con sombra sutil
- Elementos: Bordes decorativos minimalistas

**Estilo 2: "Moderno"**
- Fondo: Imagen de naturaleza con overlay oscuro
- Tipografía: Sans-serif bold (Montserrat)
- Layout: Texto grande, centrado
- Elementos: Sin decoración, minimalista

**Estilo 3: "Inspiracional"**
- Fondo: Colores vibrantes (gradiente azul → morado)
- Tipografía: Script moderna (Dancing Script + Lato)
- Layout: Texto con quote marks grandes
- Elementos: Iconos sutiles (cruz, paloma)

- **Implementación**:
  - Componentes React separados por estilo
  - Tailwind classes + Google Fonts
  - Preview en tiempo real
  - Selección mediante tabs o cards

#### F4.2: Preview del Versículo
- **Descripción**: Vista previa del diseño antes de descargar
- **Prioridad**: Alta (MVP)
- **Características**:
  - Render en canvas con dimensiones 1080x1080px (Instagram)
  - Opciones alternativas: Story (1080x1920), Landscape (1920x1080)
  - Cambio de estilo en tiempo real
  - Muestra referencia bíblica al pie

#### F4.3: Descarga de Imagen
- **Descripción**: Exportar diseño como imagen PNG
- **Prioridad**: Alta (MVP)
- **Tecnología**: html2canvas
- **Proceso**:
  1. Usuario click en "Descargar"
  2. html2canvas convierte div a canvas
  3. Canvas se exporta a blob PNG
  4. Download automático con nombre: `versiculo-[referencia]-[fecha].png`
- **Calidad**: Alta resolución (2x scaling para pantallas retina)

#### F4.4: Compartir
- **Descripción**: Compartir imagen en redes sociales o WhatsApp
- **Prioridad**: Media
- **Web**: 
  - Web Share API (si disponible)
  - Fallback: Copiar link + preview de imagen
- **Móvil (React Native)**:
  - React Native Share
  - Compartir directo a apps instaladas

### 4.5 Módulo de Historial (Post-MVP)

#### F5.1: Guardar Versículos Favoritos
- **Descripción**: Permitir guardar generaciones para reusar
- **Prioridad**: Baja (Fase 2)
- **Storage**: Firestore subcollection `users/{uid}/savedVerses`
- **Límite**: 20 versículos guardados por usuario

---

## 5. Especificaciones de UI/UX

### 5.1 Páginas/Vistas

#### Vista 1: Landing Page (No Autenticado)
**Elementos**:
- Hero section con título impactante
- CTA principal: "Empieza Gratis"
- Ejemplos visuales (carrusel de versículos personalizados)
- Explicación en 3 pasos (Elige → Personaliza → Comparte)
- Footer con links sociales

#### Vista 2: Dashboard Principal (Autenticado)
**Layout**:
```
┌─────────────────────────────────────────┐
│  [Logo]              [User] [5 tokens] │
├─────────────────────────────────────────┤
│                                         │
│    "Crea tu versículo personalizado"   │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Referencia: [Juan 14:27b       ] │ │
│  │ Temperatura: [━━━●━━━] Balanceado│ │
│  │          [Generar ✨]            │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

#### Vista 3: Resultado y Personalización
**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Volver         [User] [4 tokens]    │
├─────────────────────────────────────────┤
│  Estilos: [Clásico] [Moderno] [Inspir.]│
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │    [Preview del Versículo]     │   │
│  │         (1080x1080)             │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│     [Descargar 📥]  [Compartir 🔗]     │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 Paleta de Colores

**Colores Principales**:
- Primary: `#4A5568` (Gris oscuro elegante)
- Secondary: `#D4AF37` (Dorado suave)
- Accent: `#667EEA` (Azul profundo)
- Background: `#F7FAFC` (Gris muy claro)
- Text: `#1A202C` (Negro suave)
- Success: `#48BB78` (Verde)
- Error: `#F56565` (Rojo)

### 5.3 Tipografía

- **Headings**: Inter (Bold, 600)
- **Body**: Inter (Regular, 400)
- **Versículos (Clásico)**: Playfair Display
- **Versículos (Moderno)**: Montserrat
- **Versículos (Inspiracional)**: Dancing Script + Lato

### 5.4 Responsive Design

- **Mobile**: 320px - 767px (1 columna, touch-friendly)
- **Tablet**: 768px - 1023px (layout adaptado)
- **Desktop**: 1024px+ (máximo 1200px container)

### 5.5 Interacciones Clave

- **Loading States**: Spinner con mensaje motivacional
- **Success Animation**: Confetti o check animado
- **Error Messages**: Toast notifications (no invasivas)
- **Hover Effects**: Suaves transiciones (200ms)
- **Tokens Counter**: Siempre visible, badge destacado

---

## 6. Especificaciones Técnicas Backend

### 6.1 Cloud Functions

#### Function 1: `generatePersonalizedVerse`
**Trigger**: HTTPS Callable
**Runtime**: Node.js 18
**Timeout**: 60 segundos
**Memory**: 512MB

**Pseudocódigo**:
```javascript
export const generatePersonalizedVerse = functions.https.onCall(async (data, context) => {
  // 1. Verificar autenticación
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated');
  
  const userId = context.auth.uid;
  
  // 2. Validar inputs
  const { verseReference, verseText, temperature } = data;
  if (!verseReference || !verseText) throw new functions.https.HttpsError('invalid-argument');
  
  // 3. Verificar tokens disponibles
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  if (!userDoc.exists || userDoc.data().tokens <= 0) {
    throw new functions.https.HttpsError('resource-exhausted', 'No tokens available');
  }
  
  // 4. Llamar a Claude API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': functions.config().anthropic.key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      temperature: temperature,
      messages: [{
        role: 'user',
        content: buildPrompt(verseText, verseReference, userDoc.data().displayName)
      }]
    })
  });
  
  const claudeData = await response.json();
  const personalizedVerse = claudeData.content[0].text;
  
  // 5. Decrementar tokens (transaction)
  await admin.firestore().collection('users').doc(userId).update({
    tokens: admin.firestore.FieldValue.increment(-1),
    totalGenerated: admin.firestore.FieldValue.increment(1),
    lastGeneratedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // 6. Guardar en historial
  await admin.firestore()
    .collection('users').doc(userId)
    .collection('history').add({
      verseReference,
      originalText: verseText,
      personalizedText: personalizedVerse,
      temperature,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  
  // 7. Retornar resultado
  return {
    success: true,
    personalizedVerse,
    tokensRemaining: userDoc.data().tokens - 1
  };
});
```

#### Function 2: `initializeNewUser`
**Trigger**: Firestore onCreate (`users/{userId}`)
**Descripción**: Inicializar documento de usuario nuevo con tokens

### 6.2 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys()
                      .hasAny(['tokens']); // No permitir modificación manual de tokens
      
      // History subcollection
      match /history/{historyId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow create: if false; // Solo Cloud Functions pueden crear
      }
    }
  }
}
```

### 6.3 Firebase Configuration

**firebase.json**:
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 7. Roadmap de Desarrollo

### Fase 1: MVP (2-3 semanas)
**Sprint 1 (Semana 1)**:
- [ ] Setup proyecto React + Firebase
- [ ] Implementar autenticación Google
- [ ] UI básica (landing + dashboard)
- [ ] Input de versículo + validación

**Sprint 2 (Semana 2)**:
- [ ] Integración Bible API
- [ ] Cloud Function para Claude API
- [ ] Sistema de tokens en Firestore
- [ ] Generación de versículo personalizado

**Sprint 3 (Semana 3)**:
- [ ] 3 estilos visuales (componentes)
- [ ] Implementar html2canvas
- [ ] Descarga de imagen
- [ ] Testing + bug fixes
- [ ] Deploy a Vercel

### Fase 2: Mejoras (1-2 semanas)
- [ ] Compartir en redes sociales
- [ ] Historial de versículos generados
- [ ] Versículos favoritos
- [ ] Más estilos visuales (total 6)
- [ ] Autocompletado de referencias

### Fase 3: Mobile App (3-4 semanas)
- [ ] Setup React Native project
- [ ] Reutilizar lógica de Firebase
- [ ] Adaptar UI para móvil
- [ ] Implementar Share nativo
- [ ] Testing iOS + Android
- [ ] Publicar en stores

### Fase 4: Monetización (Post-launch)
- [ ] Integrar Stripe
- [ ] Paquetes de tokens pagos
- [ ] Estilos premium
- [ ] Sistema de suscripción mensual

---

## 8. Consideraciones de Seguridad

### 8.1 Autenticación
- Usar Firebase Auth tokens en todas las llamadas
- Validar `context.auth.uid` en Cloud Functions
- Implementar rate limiting (max 10 generaciones/hora)

### 8.2 API Keys
- Nunca exponer API keys en frontend
- Claude API key solo en Cloud Functions
- Usar Firebase Functions Config para secrets

### 8.3 Data Privacy
- Cumplir con GDPR (si aplica)
- Permitir eliminación de cuenta
- No almacenar datos sensibles innecesarios

### 8.4 Content Moderation
- Validar que referencias sean bíblicas reales
- Límite de tokens Claude (300) para evitar abuse
- Monitorear generaciones inapropiadas

---

## 9. Métricas y Analytics

### 9.1 KPIs Principales
- **User Engagement**: 
  - Usuarios activos diarios (DAU)
  - Usuarios activos mensuales (MAU)
  - Tasa de retención (D1, D7, D30)
  
- **Product Metrics**:
  - Generaciones por usuario
  - Tasa de conversión (visitante → registro)
  - Tasa de agotamiento de tokens
  - Versículos más generados
  
- **Technical Metrics**:
  - Latencia de generación (objetivo: <5s)
  - Error rate de Claude API
  - Tasa de éxito de descargas

### 9.2 Herramientas
- Google Analytics 4 (web)
- Firebase Analytics (mobile)
- Cloud Functions logs
- Sentry (error tracking)

---

## 10. Costos Estimados

### 10.1 MVP (100 usuarios/mes)
- **Firebase**: $0 (free tier cubre)
- **Claude API**: ~$20/mes (asumiendo 500 generaciones)
- **Vercel**: $0 (free tier)
- **Dominio**: $12/año
- **Total**: ~$20-25/mes

### 10.2 Escala (1,000 usuarios/mes)
- **Firebase**: $25-50/mes
- **Claude API**: ~$150/mes
- **Vercel**: $0 (aún en free tier)
- **Total**: ~$175-200/mes

### 10.3 Break-even Estimado
- Con 100 usuarios pagando $2.99/mes por 20 tokens adicionales
- Revenue: $299/mes
- Costos: $200/mes
- **Break-even**: ~70 usuarios de pago

---

## 11. Consideraciones Adicionales

### 11.1 Traducciones Bíblicas
- MVP: Solo Reina Valera 1960 (español)
- Futuro: Agregar NVI, RVR1995, NTV
- Inglés: NIV, ESV, KJV

### 11.2 Accesibilidad
- ARIA labels en todos los componentes
- Soporte para lectores de pantalla
- Contraste de colores WCAG AA
- Navegación por teclado

### 11.3 SEO
- Meta tags dinámicas por versículo
- Open Graph para compartir
- Sitemap XML
- Canonical URLs

### 11.4 Testing
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright (crítico: login, generar, descargar)
- **Manual QA**: Checklist pre-deploy

---

## 12. Anexos

### Anexo A: Ejemplo de Prompts para Claude

**Prompt Básico**:
```
Personaliza este versículo bíblico para María:
"El Señor es mi pastor, nada me falta" (Salmos 23:1)

Temperatura: 0.5 (Balanceado)
```

**Respuesta Esperada**:
```
María, el Señor es tu pastor y nada te faltará.
```

**Prompt Creativo** (temperatura 0.9):
```
Personaliza este versículo bíblico para Carlos:
"Confía en el Señor con todo tu corazón" (Proverbios 3:5)

Temperatura: 0.9 (Creativo)
```

**Respuesta Esperada**:
```
Carlos, entrega tu corazón completamente al Señor, 
confía sin reservas en su amor perfecto para ti.
```

### Anexo B: Referencias de Diseño
- Inspiración: YouVersion Bible App, Pray.com
- Tipografía: Google Fonts (gratis)
- Imágenes de fondo: Unsplash API (gratis)
- Iconos: Lucide React

### Anexo C: Contactos Técnicos
- **Firebase Support**: Console Firebase
- **Anthropic Support**: support@anthropic.com
- **Vercel Support**: Dashboard Vercel

---

## Glosario

- **SPA**: Single Page Application
- **MVP**: Minimum Viable Product
- **DAU/MAU**: Daily/Monthly Active Users
- **KPI**: Key Performance Indicator
- **CDN**: Content Delivery Network
- **GDPR**: General Data Protection Regulation
- **WCAG**: Web Content Accessibility Guidelines

---

**Documento creado**: Noviembre 2025  
**Versión**: 1.0  
**Próxima revisión**: Post-MVP feedback