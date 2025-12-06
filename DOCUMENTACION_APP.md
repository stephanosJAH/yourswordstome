# 📖 YourWordsToMe - Documentación Completa

## 🎯 ¿Qué es YourWordsToMe?

**YourWordsToMe** es una aplicación web innovadora que utiliza Inteligencia Artificial para crear versículos bíblicos personalizados. La aplicación toma cualquier versículo de la Biblia y lo adapta de manera natural y respetuosa incorporando el nombre del usuario, creando una experiencia espiritual única y personal.

### Ejemplo de Transformación

**Versículo Original:**
> "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna." - Juan 3:16

**Versículo Personalizado para "María":**
> "María, así como Dios amó al mundo entero, te amó a ti de tal manera que dio a su Hijo unigénito para que, al creer en él, no perezcas sino que tengas vida eterna."

---

## 🚀 Funcionalidades Principales

### 1. **Autenticación con Google**
- Inicio de sesión rápido y seguro mediante Google
- No requiere crear contraseñas ni formularios complejos
- Gestión automática de sesiones

### 2. **Sistema de Tokens**
- Cada usuario nuevo recibe **5 tokens gratuitos**
- Cada generación de versículo consume 1 token
- Sistema de acceso ilimitado para usuarios autorizados
- Contador visible de tokens disponibles

### 3. **Generación Personalizada con IA**
- Utiliza OpenAI (GPT-4) para personalizar versículos
- Tres niveles de creatividad:
  - **Literal**: Mantiene el máximo apego al texto original
  - **Balanceado**: Equilibrio entre fidelidad y naturalidad
  - **Creativo**: Mayor libertad en la adaptación del mensaje
- Respeta el significado teológico original
- Incorpora el nombre del usuario de forma natural

### 4. **Amplia Base de Versículos Bíblicos**
- Integración con **scripture.api.bible**
- Acceso a 7 traducciones en español:
  - Reina Valera 1909 (por defecto)
  - Nueva Biblia Viva 2008
  - Palabra de Dios para Ti
  - Versión Biblia Libre
  - Y más...
- Validación automática de referencias bíblicas
- Sistema de fallback con versículos populares

### 5. **Tres Estilos Visuales**
Cada versículo personalizado puede visualizarse en tres estilos diferentes:

#### a) **Clásico**
- Diseño elegante y tradicional
- Fondo degradado en tonos cálidos
- Tipografía serif clásica
- Ideal para imprimir o enmarcar

#### b) **Moderno**
- Diseño minimalista y contemporáneo
- Colores vibrantes y gradientes
- Tipografía sans-serif moderna
- Perfecto para redes sociales

#### c) **Inspiracional**
- Diseño motivador y luminoso
- Elementos visuales dinámicos
- Énfasis en el mensaje
- Excelente para compartir digitalmente

### 6. **Descarga en Alta Resolución**
- Exportación de imágenes PNG de alta calidad (2x resolución)
- Tecnología html2canvas para renderizado preciso
- Nombre de archivo automático con referencia y timestamp
- Optimizado para impresión y publicación digital

### 7. **Compartir en Redes Sociales**
- Integración con Web Share API
- Compartir directamente desde la app (en dispositivos compatibles)
- Opción de descarga alternativa

### 8. **Historial de Generaciones**
- Cada versículo personalizado se guarda automáticamente
- Registro de:
  - Referencia bíblica
  - Texto original
  - Texto personalizado
  - Nivel de creatividad usado
  - Proveedor de IA utilizado
  - Fecha y hora de creación

---

## 🏗️ Arquitectura Técnica

### **Stack Tecnológico**

#### Frontend
- **React 18**: Framework principal para la UI
- **Vite**: Build tool ultra-rápido
- **React Router v6**: Navegación entre páginas
- **Tailwind CSS**: Estilización moderna y responsive
- **Lucide React**: Iconografía moderna

#### Backend/Servicios
- **Firebase Authentication**: Gestión de usuarios
- **Cloud Firestore**: Base de datos NoSQL
- **OpenAI API (GPT-4)**: Inteligencia Artificial
- **scripture.api.bible**: API de versículos bíblicos

#### Utilidades
- **html2canvas**: Generación de imágenes
- **ESLint**: Linting de código

### **Estructura de Archivos**

```
src/
├── App.jsx                      # Componente principal con rutas
├── main.jsx                     # Punto de entrada
├── index.css                    # Estilos globales
│
├── components/
│   └── visual/
│       ├── ClassicStyle.jsx     # Estilo clásico
│       ├── ModernStyle.jsx      # Estilo moderno
│       └── InspirationalStyle.jsx # Estilo inspiracional
│
├── contexts/
│   └── AuthContext.jsx          # Context API para autenticación
│
├── pages/
│   ├── LandingPage.jsx          # Página de inicio
│   ├── Dashboard.jsx            # Panel principal (generación)
│   └── ResultPage.jsx           # Página de resultados
│
├── services/
│   ├── authService.js           # Lógica de autenticación
│   ├── bibleService.js          # Obtención de versículos
│   ├── userService.js           # Gestión de usuarios y tokens
│   ├── verseGeneratorService.js # Orquestador principal
│   └── ai/
│       ├── AIProvider.js        # Clase base abstracta
│       ├── AIProviderFactory.js # Factory pattern
│       ├── OpenAIProvider.js    # Implementación OpenAI
│       ├── ClaudeProvider.js    # Implementación Claude
│       └── index.js             # Exports
│
└── config/
    └── firebase.js              # Configuración de Firebase
```

---

## 🔄 Flujo de la Aplicación

### **1. Inicio de Sesión**

```
Usuario visita la app
    ↓
Landing Page con presentación
    ↓
Clic en "Empieza Gratis"
    ↓
Autenticación con Google
    ↓
Firebase crea/recupera usuario
    ↓
Si es nuevo: se asignan 5 tokens
    ↓
Redirección al Dashboard
```

### **2. Generación de Versículo**

```
Usuario en Dashboard
    ↓
Ingresa referencia bíblica (ej: "Juan 3:16")
    ↓
Selecciona nivel de creatividad (Literal/Balanceado/Creativo)
    ↓
Clic en "Generar Versículo"
    ↓
Sistema valida:
  - ¿Referencia válida?
  - ¿Tiene tokens disponibles?
    ↓
Busca versículo en scripture.api.bible
    ↓
Envía a OpenAI GPT-4:
  - Texto original del versículo
  - Nombre del usuario
  - Nivel de temperatura (creatividad)
    ↓
IA genera versículo personalizado
    ↓
Sistema:
  - Decrementa 1 token
  - Guarda en historial
  - Actualiza estadísticas
    ↓
Redirección a página de resultados
```

### **3. Visualización y Descarga**

```
Usuario en ResultPage
    ↓
Ve su versículo personalizado
    ↓
Selecciona estilo visual (Clásico/Moderno/Inspiracional)
    ↓
Vista previa en tiempo real
    ↓
Opciones:
  ├─ Descargar imagen PNG (alta resolución)
  ├─ Compartir en redes sociales
  └─ Volver al Dashboard para generar otro
```

---

## 🗄️ Estructura de Base de Datos (Firestore)

### **Colección: `users`**

```javascript
users/{userId}
{
  email: "usuario@gmail.com",
  displayName: "Juan Pérez",
  photoURL: "https://...",
  tokens: 5,                      // Tokens disponibles
  totalGenerated: 3,              // Total de versículos generados
  createdAt: Timestamp,
  lastGeneratedAt: Timestamp,
  
  // Subcolección
  history/{docId}
  {
    verseReference: "Juan 3:16",
    originalText: "Porque de tal manera...",
    personalizedText: "Juan, así como Dios...",
    temperature: 0.5,
    aiProvider: "openai",
    createdAt: Timestamp
  }
}
```

---

## 🤖 Sistema de IA (Arquitectura Modular)

### **Patrón de Diseño: Factory Pattern**

La aplicación está diseñada para soportar múltiples proveedores de IA:

```javascript
// AIProviderFactory.js
class AIProviderFactory {
  static createProvider(providerName, apiKey) {
    switch (providerName) {
      case 'openai':
        return new OpenAIProvider(apiKey);
      case 'claude':
        return new ClaudeProvider(apiKey);
      default:
        return new OpenAIProvider(apiKey);
    }
  }
}
```

### **Clase Base Abstracta**

```javascript
// AIProvider.js
class AIProvider {
  buildPrompt(verseText, verseReference, userName, temperature) {
    // Construye el prompt optimizado
    // Instrucciones específicas según temperatura
    // Retorna prompt personalizado
  }
  
  async generatePersonalizedVerse({...}) {
    // Método abstracto
    // Implementado por cada proveedor específico
  }
}
```

### **Implementaciones Actuales**

1. **OpenAIProvider** (Activo)
   - Usa GPT-4
   - Endpoint: `https://api.openai.com/v1/chat/completions`
   - Max tokens: 300
   - Sistema de mensajes optimizado

2. **ClaudeProvider** (Preparado)
   - Usa Claude de Anthropic
   - Listo para activarse cuando se necesite

### **Prompt Engineering**

El prompt se construye dinámicamente según el nivel de creatividad:

#### **Temperatura 0.0-0.34 (Literal)**
```
"Adapta este versículo de manera muy literal y conservadora,
manteniendo el máximo apego al texto original..."
```

#### **Temperatura 0.35-0.65 (Balanceado)**
```
"Adapta este versículo de manera natural y equilibrada,
incorporando el nombre del usuario de forma fluida..."
```

#### **Temperatura 0.66-1.0 (Creativo)**
```
"Adapta este versículo de manera creativa e inspiradora,
permitiendo mayor libertad expresiva..."
```

---

## 🔒 Sistema de Seguridad

### **Autenticación**
- Firebase Authentication con Google OAuth 2.0
- Tokens JWT automáticos
- Sesiones persistentes y seguras

### **Firestore Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
      
      match /history/{docId} {
        allow read, write: if request.auth != null 
                           && request.auth.uid == userId;
      }
    }
  }
}
```

### **Variables de Entorno**
Todas las credenciales se almacenan de forma segura:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_OPENAI_API_KEY=...
VITE_BIBLE_API_KEY=...
```

---

## 📊 Características del Sistema de Tokens

### **Usuarios Estándar**
- 5 tokens gratuitos al registrarse
- 1 token por generación
- Contador visible en todas las páginas
- Mensaje de error al agotarse

### **Usuarios con Acceso Ilimitado**
- Email autorizado: `estebanicamp@gmail.com`
- Símbolo de infinito (∞) en contador
- No se decrementan tokens
- Se registran estadísticas normalmente

### **Lógica de Verificación**
```javascript
const hasUnlimitedAccess = (userEmail) => {
  return userEmail === 'estebanicamp@gmail.com';
};

const hasTokensAvailable = async (userId) => {
  const userData = await getUserData(userId);
  if (hasUnlimitedAccess(userData.email)) return true;
  return userData && userData.tokens > 0;
};
```

---

## 🎨 Sistema de Estilos Visuales

### **ClassicStyle.jsx**
```jsx
- Fondo: Degradado beige a crema
- Tipografía: Serif elegante
- Borde: Marco decorativo
- Uso: Impresión, marcos, contextos formales
```

### **ModernStyle.jsx**
```jsx
- Fondo: Gradiente púrpura a azul
- Tipografía: Sans-serif moderna
- Diseño: Minimalista y limpio
- Uso: Redes sociales, contextos contemporáneos
```

### **InspirationalStyle.jsx**
```jsx
- Fondo: Luminoso con rayos de luz
- Tipografía: Impactante
- Elementos: Dinámicos y motivadores
- Uso: Compartir, inspirar, motivar
```

### **Renderizado de Imágenes**
```javascript
html2canvas(element, {
  scale: 2,              // Alta resolución (2x)
  useCORS: true,         // Permitir imágenes externas
  backgroundColor: null  // Transparencia
})
```

---

## 🌐 API de Versículos Bíblicos

### **scripture.api.bible**

#### **Características**
- API RESTful oficial
- 7 traducciones en español
- Acceso gratuito con API key
- Rate limits razonables

#### **Traducciones Disponibles**

| ID | Nombre | Año |
|---|---|---|
| `RVR09` | Reina Valera 1909 | 1909 |
| `NBV` | Nueva Biblia Viva | 2008 |
| `PDPT` | Palabra de Dios para Ti | - |
| `VBL` | Versión Biblia Libre | - |

#### **Mapeo de Libros**
El sistema traduce nombres en español a códigos de API:
```javascript
'Juan' → 'JHN'
'Salmos' → 'PSA'
'1 Corintios' → '1CO'
'Génesis' → 'GEN'
```

#### **Ejemplo de Uso**
```javascript
fetchVerse('Juan 3:16')
  ↓
parseReference('Juan 3:16')
  ↓
{ book: 'JHN', chapter: 3, verse: 16 }
  ↓
GET api.bible.com/v1/bibles/RVR09/verses/JHN.3.16
  ↓
{
  reference: 'Juan 3:16',
  text: 'Porque de tal manera...',
  translation_name: 'Reina Valera 1909'
}
```

#### **Sistema de Fallback**
Si la API falla, se usan versículos populares precargados:
- Juan 3:16, Juan 14:27
- Salmos 23:1
- Filipenses 4:13
- Jeremías 29:11
- Y más...

---

## 🔍 Validación de Referencias

### **Formatos Aceptados**
```
✅ Juan 3:16
✅ 1 Corintios 13:4-8
✅ Salmos 23:1
✅ Génesis 1:1
✅ Romanos 8:28

❌ Juan 3  (falta versículo)
❌ 3:16    (falta libro)
❌ Juan    (incompleto)
```

### **Regex de Validación**
```javascript
const referenceRegex = /^[1-3]?\s*[a-záéíóúñ]+\s+\d+:\d+(-\d+)?$/i;
```

---

## 📱 Responsive Design

La aplicación está completamente optimizada para:

### **Desktop** (1024px+)
- Layout de 3 columnas para estilos
- Tipografías grandes
- Espaciado generoso

### **Tablet** (768px - 1023px)
- Layout de 2 columnas
- Tipografías medianas
- Navegación optimizada

### **Mobile** (< 768px)
- Layout de 1 columna
- Tipografías adaptativas
- Botones táctiles grandes
- Scroll horizontal para estilos

---

## 🚀 Deployment

### **Configuración de Producción**

#### **Vercel** (Recomendado)
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### **Variables de Entorno en Producción**
Configurar en el dashboard de Vercel:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_OPENAI_API_KEY`
- `VITE_BIBLE_API_KEY`

#### **Build Command**
```bash
npm run build
```

#### **Output Directory**
```
dist/
```

---

## 📈 Métricas y Estadísticas

### **Por Usuario**
- `totalGenerated`: Total de versículos generados
- `lastGeneratedAt`: Última generación
- `tokens`: Tokens restantes
- `createdAt`: Fecha de registro

### **Por Versículo Generado**
- Referencia bíblica
- Texto original y personalizado
- Nivel de creatividad (temperatura)
- Proveedor de IA usado
- Timestamp de creación

---

## 🎯 Casos de Uso

### **1. Devocionales Personales**
Crear versículos personalizados para meditación diaria

### **2. Regalos Digitales**
Enviar versículos personalizados a amigos y familiares

### **3. Contenido para Redes Sociales**
Generar imágenes inspiradoras para compartir

### **4. Material de Iglesias**
Crear material visual para servicios y eventos

### **5. Reflexiones Personales**
Explorar cómo las Escrituras hablan directamente al usuario

---

## 🔮 Futuras Mejoras Potenciales

### **Funcionalidades**
- [ ] Sistema de compra de tokens
- [ ] Más estilos visuales personalizables
- [ ] Editor de estilos (colores, fuentes)
- [ ] Versículos del día automáticos
- [ ] Compartir directamente a redes específicas
- [ ] Historial con búsqueda y filtros
- [ ] Exportar múltiples formatos (JPG, PDF)
- [ ] Versículos en video (animaciones)

### **Técnicas**
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Tests automatizados
- [ ] Optimización de imágenes WebP
- [ ] Cache de API Bible
- [ ] Analytics de uso

### **Proveedores de IA**
- [ ] Activar Claude como alternativa
- [ ] Soporte para Gemini (Google)
- [ ] Comparador de resultados entre IAs

---

## 📚 Recursos y Documentación

### **Documentos del Proyecto**
- `README.md` - Introducción general
- `SETUP.md` - Guía de instalación
- `BIBLE_API_GUIDE.md` - Documentación de Bible API
- `API_KEYS_GUIDE.md` - Obtención de API keys
- `SERVICE_ACCOUNT_GUIDE.md` - Firebase admin
- `MIGRATION_SUMMARY.md` - Historial de migraciones
- `MVP_SUMMARY.md` - Definición del MVP

### **APIs Externas**
- [OpenAI Documentation](https://platform.openai.com/docs)
- [scripture.api.bible](https://scripture.api.bible/)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## 💡 Filosofía del Proyecto

**YourWordsToMe** fue creada con la visión de hacer las Escrituras más accesibles y personales. La tecnología de IA no reemplaza ni modifica el mensaje divino, sino que actúa como un puente para ayudar a las personas a sentir que las Palabras de Dios hablan directamente a ellas.

### **Principios**
1. **Respeto Teológico**: Mantener la integridad del mensaje bíblico
2. **Personalización Natural**: Incorporar nombres sin forzar el texto
3. **Accesibilidad**: Fácil de usar para todos
4. **Calidad Visual**: Diseños dignos de compartir
5. **Privacidad**: Datos seguros y protegidos

---

## 🙏 Créditos

### **Tecnologías**
- React + Vite
- Firebase (Google)
- OpenAI GPT-4
- scripture.api.bible (American Bible Society)
- Tailwind CSS
- Lucide Icons

### **Desarrollado por**
ampiUP Projects

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

---

**Versión de Documentación**: 1.0  
**Última Actualización**: 19 de noviembre de 2025  
**Versión de la App**: 1.0.0
