# YourWordsToMe - Guía de Deploy con Easypanel

## 📋 Resumen de la Arquitectura

### **Stack Tecnológico**

#### **Frontend (React SPA)**
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Build**: Vite (genera archivos estáticos)
- **Puerto desarrollo**: 3000

#### **Backend (Firebase)**
- **Cloud Functions**: Node.js 20 (2nd Gen)
  - `generateVerse`: Genera versículos personalizados con OpenAI
  - `getTokensRemaining`: Consulta tokens del usuario
- **Firestore**: Base de datos NoSQL
  - Colección `users`: Datos de usuarios y tokens
  - Subcolección `generated_verses`: Versículos generados por usuario
- **Authentication**: Firebase Auth con Google OAuth
- **Secrets Manager**: Almacena API keys de forma segura

#### **APIs Externas**
- **OpenAI API**: GPT-4o-mini para personalización de versículos
- **Bible API**: bible-api.com (fallback a cache local)

---

## 🏗️ Estructura del Proyecto

```
yourswordsforme/
├── src/                          # Frontend React
│   ├── components/               # Componentes reutilizables
│   │   ├── CustomNameModal.jsx  # Modal para nombre personalizado
│   │   ├── ThemeToggle.jsx      # Toggle dark/light mode
│   │   └── visual/              # Estilos visuales de versículos
│   │       ├── ClassicStyle.jsx
│   │       ├── InspirationalStyle.jsx
│   │       └── ModernStyle.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx      # Contexto global de autenticación
│   ├── hooks/
│   │   └── useVersesHistory.js  # Hook para gestionar historial
│   ├── pages/
│   │   ├── Dashboard.jsx        # Página principal (generador)
│   │   ├── ResultPage.jsx       # Página de resultado
│   │   ├── LandingPage.jsx      # Landing pública
│   │   └── AboutPage.jsx        # Acerca de
│   ├── services/                # Lógica de negocio
│   │   ├── authService.js       # Autenticación Firebase
│   │   ├── userService.js       # Gestión de usuarios
│   │   ├── verseGeneratorService.js  # Llamada a Cloud Function
│   │   ├── verseHistoryService.js    # Historial de versículos
│   │   └── ai/                  # Arquitectura multi-proveedor IA
│   │       ├── AIProviderFactory.js
│   │       ├── OpenAIProvider.js
│   │       └── ClaudeProvider.js
│   └── config/
│       └── firebase.js          # Configuración Firebase SDK
│
├── functions/                   # Firebase Cloud Functions
│   ├── index.js                # Funciones: generateVerse, getTokensRemaining
│   └── package.json
│
├── .env                        # Variables de entorno (NO subir a Git)
├── package.json                # Dependencias frontend
├── vite.config.js              # Configuración Vite
├── tailwind.config.js          # Configuración Tailwind
└── firebase.json               # Configuración Firebase

```

---

## 🔄 Flujo de la Aplicación

### **1. Autenticación**
```
Usuario → Click "Iniciar con Google" 
       → authService.signInWithGoogle()
       → Firebase Auth (OAuth)
       → Firestore crea/actualiza documento en users/
       → userData incluye: email, tokens (5 iniciales), totalGenerated
```

### **2. Generación de Versículo**
```
Dashboard → Usuario ingresa referencia (ej: "Efesios 2:10")
         → verseGeneratorService.generatePersonalizedVerse()
         → Cloud Function: generateVerse
              ↓
         [En Firebase Cloud Function]
         1. Verifica autenticación del usuario
         2. Traduce referencia español → inglés (ej: Efesios → Ephesians)
         3. Busca versículo en cache local O llama a bible-api.com
         4. Genera personalización con OpenAI GPT-4o-mini
         5. Transacción Firestore:
            - Guarda en users/{uid}/generated_verses/{id}
            - Decrementa tokens (excepto usuario ilimitado)
         6. Retorna resultado al frontend
              ↓
         → ResultPage muestra versículo personalizado
         → Usuario puede descargar imagen (html2canvas)
```

### **3. Historial de Versículos**
```
Dashboard → useVersesHistory hook
         → Firestore listener en users/{uid}/generated_verses
         → Muestra últimos 6 versículos en cards clickeables
         → Funciones: marcar favorito, eliminar, ver detalle
```

---

## 🚀 Deploy con Easypanel en VPS

### **Pre-requisitos**
1. VPS con Ubuntu 20.04+ (mínimo 2GB RAM)
2. Dominio apuntando al VPS
3. Easypanel instalado ([https://easypanel.io/docs/installation](https://easypanel.io/docs/installation))
4. Proyecto Firebase configurado
5. API Keys obtenidas (OpenAI, Bible API)

---

### **Paso 1: Configurar Firebase**

#### **1.1 Cloud Functions**
```bash
# En tu máquina local
cd functions/

# Configurar secretos (IMPORTANTE: se almacenan en Firebase Secrets Manager)
firebase functions:secrets:set OPENAI_API_KEY
# Pegar tu API key de OpenAI: sk-proj-...

# Desplegar funciones
firebase deploy --only functions
```

✅ **Resultado**: Functions desplegadas en:
- `https://us-central1-yourswordsforme.cloudfunctions.net/generateVerse`
- `https://us-central1-yourswordsforme.cloudfunctions.net/getTokensRemaining`

#### **1.2 Firestore Rules**
```bash
firebase deploy --only firestore:rules
```

---

### **Paso 2: Preparar Frontend para Producción**

#### **2.1 Crear archivo `.env.production`**
```bash
# En la raíz del proyecto
nano .env.production
```

```env
# Firebase Configuration (público - se embebe en el bundle)
VITE_FIREBASE_API_KEY=AIzaSyCGNTPU2aTYKO_bLhgtlRjOOimtlMT9Wwk
VITE_FIREBASE_AUTH_DOMAIN=yourswordsforme.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourswordsforme
VITE_FIREBASE_STORAGE_BUCKET=yourswordsforme.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=552386049267
VITE_FIREBASE_APP_ID=1:552386049267:web:06dc7378b23de509e97386

# NO incluir VITE_OPENAI_API_KEY aquí (se usa en Cloud Functions)
# NO incluir VITE_BIBLE_API_KEY aquí (no se usa en producción, se usa bible-api.com)
```

#### **2.2 Build del proyecto**
```bash
npm install
npm run build
```

✅ **Resultado**: Carpeta `dist/` con archivos estáticos optimizados

---

### **Paso 3: Desplegar en Easypanel**

#### **3.1 Crear Aplicación en Easypanel**

1. **Login a Easypanel**: `https://tu-vps-ip:3000`
2. **Crear nuevo proyecto**: `yourswordsforme`
3. **Agregar aplicación**: Tipo "Web Application"

#### **3.2 Configuración de la App**

**Método 1: Desde Git (Recomendado)**
```yaml
Nombre: yourswordsforme-frontend
Tipo: GitHub Repository

Repository: https://github.com/stephanosJAH/yourswordstome
Branch: main
Build Command: npm install && npm run build
Output Directory: dist

Environment Variables:
  VITE_FIREBASE_API_KEY: AIzaSyCGNTPU2aTYKO_bLhgtlRjOOimtlMT9Wwk
  VITE_FIREBASE_AUTH_DOMAIN: yourswordsforme.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID: yourswordsforme
  VITE_FIREBASE_STORAGE_BUCKET: yourswordsforme.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID: 552386049267
  VITE_FIREBASE_APP_ID: 1:552386049267:web:06dc7378b23de509e97386

Port: 80
```

**Método 2: Docker (Alternativa)**
Crear `Dockerfile` en la raíz:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build con variables de entorno
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Crear `nginx.conf`:**
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA: redirigir todas las rutas a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

En Easypanel:
```yaml
Nombre: yourswordsforme-frontend
Tipo: Docker

Build Args:
  VITE_FIREBASE_API_KEY: AIzaSyCGNTPU2aTYKO_bLhgtlRjOOimtlMT9Wwk
  VITE_FIREBASE_AUTH_DOMAIN: yourswordsforme.firebaseapp.com
  # ... resto de variables

Port: 80
```

#### **3.3 Configurar Dominio**

1. En Easypanel → Tu app → "Domains"
2. Agregar dominio: `yourswordsforme.com`
3. Easypanel auto-configura SSL con Let's Encrypt

#### **3.4 Actualizar Firebase Auth**

En [Firebase Console](https://console.firebase.google.com):
1. Authentication → Settings → Authorized domains
2. Agregar: `yourswordsforme.com`

---

### **Paso 4: Verificación Post-Deploy**

#### **Checklist**
- [ ] App carga en `https://tu-dominio.com`
- [ ] Login con Google funciona
- [ ] Generar versículo funciona (consume token)
- [ ] Historial se guarda en Firestore
- [ ] Descarga de imagen funciona
- [ ] SSL activo (candado verde)

#### **Logs**
```bash
# Logs de Cloud Functions
firebase functions:log --only generateVerse

# Logs de Easypanel
Easypanel → Tu app → Logs
```

---

## 🔒 Seguridad

### **Variables Sensibles**

| Variable | Ubicación | Seguridad |
|----------|-----------|-----------|
| `OPENAI_API_KEY` | Firebase Secrets Manager | ✅ Segura (solo Cloud Functions) |
| Firebase Config | `.env` → Bundle JS | ✅ Segura (pública pero con Firestore Rules) |
| Service Account | `functions/` (local) | ⚠️ NUNCA subir a Git |

### **Firestore Rules** (ya desplegadas)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Solo el usuario puede leer/escribir sus datos
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /generated_verses/{verseId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## 🛠️ Troubleshooting

### **Error: "Cloud Function failed"**
```bash
# Ver logs detallados
firebase functions:log

# Verificar secretos
firebase functions:secrets:access OPENAI_API_KEY
```

### **Error: Versículo no encontrado**
- Causa: Bible API no encontró la referencia
- Solución: Agregada en el último deploy la traducción español→inglés

### **Error: CORS en Cloud Functions**
- Causa: Dominio no autorizado
- Solución: Verificar `cors: true` en `functions/index.js`

### **App no carga después de deploy**
```bash
# Verificar build
npm run build

# Probar localmente
npm run preview

# Verificar nginx logs en Easypanel
```

---

## 📊 Monitoreo

### **Firebase Console**
- **Authentication**: Usuarios activos
- **Firestore**: Uso de base de datos
- **Functions**: Invocaciones, errores, latencia

### **Easypanel Dashboard**
- **CPU/RAM**: Uso de recursos
- **Logs**: Errores de aplicación
- **SSL**: Estado del certificado

---

## 🚀 Actualizaciones Futuras

### **Frontend**
```bash
# Hacer cambios en código
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Easypanel hace auto-deploy si está configurado con GitHub
# O manualmente: Deploy → Redeploy
```

### **Cloud Functions**
```bash
cd functions/
# Editar index.js
firebase deploy --only functions:generateVerse
```

---

## 📝 Notas Importantes

1. **Cloud Functions es el backend**: Toda la lógica crítica (tokens, IA, Firestore) está ahí
2. **Frontend es solo UI**: React solo muestra datos y llama a Cloud Functions
3. **Sin servidor Node.js**: No necesitas Express/Node en VPS, solo servir archivos estáticos
4. **Escalabilidad**: Firebase Functions escala automáticamente
5. **Costo**: Firebase Spark (gratis) soporta hasta 125K invocaciones/mes

---

## 💡 Arquitectura Serverless

```
[Usuario Browser]
      ↓
[Easypanel/Nginx] ← Sirve React SPA (archivos estáticos)
      ↓
[Firebase SDK en Browser] ← Llama a Cloud Functions
      ↓
[Firebase Cloud Functions] ← Lógica backend (Node.js)
      ↓
[Firestore + OpenAI API] ← Datos y procesamiento
```

**Ventajas**:
- ✅ Sin mantener servidor Node.js
- ✅ Escala automáticamente
- ✅ API keys seguras (Secrets Manager)
- ✅ Firestore Rules protegen datos
- ✅ Deploy simple (solo HTML/CSS/JS estáticos)
