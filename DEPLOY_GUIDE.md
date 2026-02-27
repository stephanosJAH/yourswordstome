# 🚀 Guía de Deploy: YourWordsToMe → Easypanel

> **Guía estructurada por ambiente de ejecución**  
> Sigue los pasos en orden para un deploy exitoso

---

## 🗺️ Mapa de Ruta del Despliegue

Vas a trabajar en **tres ambientes distintos**:

1. **💻 Tu Computadora (Terminal Local)**: Configurar Backend (Firebase) y preparar repositorio
2. **☁️ GitHub**: Almacenar código fuente actualizado
3. **🌐 Easypanel (Navegador Web)**: Construir y servir el Frontend

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

- ✅ Proyecto Firebase creado ([console.firebase.google.com](https://console.firebase.google.com))
- ✅ Firebase CLI instalado (`npm install -g firebase-tools`)
- ✅ Autenticado en Firebase (`firebase login`)
- ✅ OpenAI API Key ([platform.openai.com/api-keys](https://platform.openai.com/api-keys))
- ✅ VPS con Easypanel instalado
- ✅ Dominio apuntando al VPS (opcional pero recomendado)

---

## 1️⃣ AMBIENTE: 💻 Tu Computadora (Backend & Secretos)

### **Objetivo**: Desplegar Cloud Functions y configurar API Keys seguras

### **Paso 1.1: Configurar el Secreto de OpenAI**

```bash
# Navegar a la carpeta de funciones
cd functions

# Configurar el secreto (VITAL para generateVerse)
firebase functions:secrets:set OPENAI_API_KEY
```

Cuando te pida el valor, **pega tu API key de OpenAI**:
```
sk-proj-TU_API_KEY_DE_OPENAI_AQUI
```

### **Paso 1.2: Desplegar Cloud Functions**

```bash
# Regresar a la raíz del proyecto
cd ..

# Desplegar las funciones
firebase deploy --only functions

# Desplegar las reglas de Firestore
firebase deploy --only firestore:rules
```

### ✅ **Checkpoint 1**: 

Abre la [Consola de Firebase](https://console.firebase.google.com) y verifica:

- [ ] Functions → `generateVerse` aparece con estado "Activo" ✓
- [ ] Functions → `getTokensRemaining` aparece con estado "Activo" ✓
- [ ] Firestore → Rules están desplegadas

**URLs de tus funciones** (guárdalas para referencia):
```
https://us-central1-yourswordsforme.cloudfunctions.net/generateVerse
https://us-central1-yourswordsforme.cloudfunctions.net/getTokensRemaining
```

---

## 2️⃣ AMBIENTE: 💻 Tu Computadora (Preparación Frontend)

### **Objetivo**: Crear archivos de configuración Docker y subirlos a GitHub

### **Paso 2.1: Verificar Archivos de Configuración**

Los siguientes archivos ya fueron creados en la raíz del proyecto:

- ✅ `Dockerfile` - Configuración multi-stage para build optimizado
- ✅ `nginx.conf` - Servidor web para SPA React
- ✅ `.dockerignore` - Optimización del contexto de build
- ✅ `EASYPANEL_DEPLOY.md` - Esta guía completa

### **Paso 2.2: Subir Cambios a GitHub**

```bash
# Verificar el estado del repositorio
git status

# Los archivos ya están commiteados, solo hacer push
git push origin main
```

### ✅ **Checkpoint 2**:

Abre tu repositorio en GitHub y verifica:

- [ ] Archivos `Dockerfile` y `nginx.conf` están en la raíz
- [ ] El commit "chore: add docker configuration for easypanel deployment" está visible

---

## 3️⃣ AMBIENTE: 🌐 Easypanel (Deploy Frontend)

### **Objetivo**: Construir y servir la aplicación React

### **Paso 3.1: Crear Proyecto en Easypanel**

1. Abre Easypanel en tu navegador: `https://tu-vps-ip:3000`
2. Click en **"Create Project"**
3. Nombre del proyecto: `yourswordsforme`
4. Click en **"Create"**

### **Paso 3.2: Crear Aplicación**

1. Dentro del proyecto, click en **"Create App"**
2. Selecciona **"GitHub"** como fuente
3. Autoriza a Easypanel a acceder a tu repositorio (si es la primera vez)
4. Selecciona el repositorio: `stephanosJAH/yourswordstome`
5. Branch: `main`

### **Paso 3.3: Configurar Build**

En la sección **"Build Settings"**:

| Campo | Valor |
|-------|-------|
| **Build Method** | Dockerfile |
| **Dockerfile Path** | `./Dockerfile` |
| **Build Context** | `.` |

### **Paso 3.4: Configurar Variables de Entorno (Build Args)**

Click en **"Environment"** → **"Build Arguments"** y agrega:

```env
VITE_FIREBASE_API_KEY=AIzaSyCGNTPU2aTYKO_bLhgtlRjOOimtlMT9Wwk
VITE_FIREBASE_AUTH_DOMAIN=yourswordsforme.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourswordsforme
VITE_FIREBASE_STORAGE_BUCKET=yourswordsforme.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=552386049267
VITE_FIREBASE_APP_ID=1:552386049267:web:06dc7378b23de509e97386
```

> ⚠️ **Importante**: Estas variables se embeben en el build (son públicas). Las API keys sensibles (OpenAI) están en Firebase Secrets Manager.

### **Paso 3.5: Configurar Puerto y Dominio**

1. **Port Mapping**:
   - Container Port: `80`
   - Expose Port: `80` (o `443` si usas SSL)

2. **Domain** (opcional):
   - Click en **"Domains"** → **"Add Domain"**
   - Ingresa tu dominio: `yourswordsforme.com`
   - Easypanel configurará automáticamente SSL con Let's Encrypt

### **Paso 3.6: Desplegar**

1. Click en **"Deploy"**
2. Espera a que el build termine (puede tomar 3-5 minutos)
3. Verás logs en tiempo real del proceso de build

### ✅ **Checkpoint 3**:

Una vez completado el deploy:

- [ ] Status muestra **"Running"** (verde)
- [ ] Puedes acceder a la URL temporal de Easypanel
- [ ] O a tu dominio personalizado (si lo configuraste)

---

## 4️⃣ AMBIENTE: 🌐 Firebase Console (Configuración Final)

### **Paso 4.1: Autorizar Dominio en Firebase Auth**

1. Abre [Firebase Console](https://console.firebase.google.com)
2. Navega a **Authentication** → **Settings** → **Authorized Domains**
3. Click en **"Add Domain"**
4. Agrega tu dominio: `yourswordsforme.com` (o la URL de Easypanel)
5. Click en **"Add"**

> ⚠️ **Crítico**: Sin este paso, el login con Google NO funcionará en producción.

---

## 5️⃣ VERIFICACIÓN COMPLETA

### **Checklist de Funcionalidad**

Abre tu aplicación en el navegador y verifica:

- [ ] ✅ La página carga correctamente
- [ ] ✅ No hay errores en la consola del navegador (F12)
- [ ] ✅ Click en **"Iniciar con Google"** → Login funciona
- [ ] ✅ Dashboard muestra tokens disponibles (5 para nuevos usuarios)
- [ ] ✅ Ingresar referencia "Juan 3:16" → Generar versículo
- [ ] ✅ Se muestra el versículo personalizado
- [ ] ✅ Tokens se decrementan de 5 a 4
- [ ] ✅ El versículo aparece en "Mis Versículos Generados"
- [ ] ✅ Click en la card → Navega a ResultPage
- [ ] ✅ Botón **"Descargar"** → Genera imagen correctamente
- [ ] ✅ Probar con "Efesios 2:10" (verifica traducción español→inglés)
- [ ] ✅ Marcar como favorito → Aparece en sección "Favoritos"
- [ ] ✅ Recargar página (F5) → No da error 404

### **Verificar Logs**

#### **Logs de Cloud Functions**
```bash
# En tu terminal local
firebase functions:log --only generateVerse
```

Deberías ver algo como:
```
2025-12-09T12:00:00.000Z ? Fetching verse: Juan 3:16
2025-12-09T12:00:00.100Z ? Verse found in local cache: Juan 3:16
2025-12-09T12:00:00.200Z ? Generating personalized verse for: Esteban
2025-12-09T12:00:02.500Z ? Verse generated successfully
```

#### **Logs de Easypanel**
1. En Easypanel → Tu App → **"Logs"**
2. Verifica que Nginx esté corriendo sin errores

---

## 🔧 Troubleshooting

### **Error: "Cloud Function failed"**

**Síntomas**: Al generar versículo aparece error genérico

**Solución**:
```bash
# Verificar logs detallados
firebase functions:log

# Verificar que el secreto esté configurado
firebase functions:secrets:access OPENAI_API_KEY
```

**Causas comunes**:
- Secreto OPENAI_API_KEY no configurado
- API Key de OpenAI inválida o sin saldo
- Cloud Functions no desplegadas

---

### **Error: "Versículo no encontrado - Efesios 2:10"**

**Síntomas**: Versículos en español no se encuentran

**Solución**: Verificar que la última versión de `functions/index.js` esté desplegada:

```bash
firebase deploy --only functions:generateVerse
```

La versión actual incluye el diccionario de traducción español→inglés.

---

### **Error: 404 al recargar la página**

**Síntomas**: Al recargar `/dashboard` o `/result` da error 404

**Solución**: Verificar que `nginx.conf` tenga la configuración de SPA:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Si no está, actualizar el archivo y hacer re-deploy:
```bash
git add nginx.conf
git commit -m "fix: update nginx config for SPA routing"
git push origin main
# Luego en Easypanel: Deploy → Rebuild
```

---

### **Error: Login con Google no funciona**

**Síntomas**: Click en "Iniciar con Google" no hace nada o da error CORS

**Solución**:

1. Verificar en Firebase Console → Authentication → Authorized Domains
2. Asegurar que tu dominio esté listado
3. Verificar en consola del navegador (F12) si hay errores de CORS

---

### **Error: Build falla en Easypanel**

**Síntomas**: Logs muestran errores de `npm install` o `npm run build`

**Solución**:

```bash
# Probar build localmente
npm install
npm run build

# Si funciona local, verificar:
# 1. Variables de entorno en Easypanel (Build Args)
# 2. Versión de Node.js (debe ser 20)
```

---

### **Error: App carga pero no conecta con Firebase**

**Síntomas**: App carga pero al hacer login o generar versículo no pasa nada

**Solución**:

1. Abrir consola del navegador (F12)
2. Buscar errores de configuración de Firebase
3. Verificar que las variables de entorno en Easypanel coincidan con `.env`:

```bash
# Verificar localmente
cat .env | grep VITE_FIREBASE

# Comparar con Build Args en Easypanel
```

---

## 🔄 Actualizaciones Futuras

### **Actualizar Frontend**

```bash
# 1. Hacer cambios en el código
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 2. En Easypanel
# Si configuraste auto-deploy: Se despliega automáticamente
# Si no: App → Deploy → Rebuild
```

### **Actualizar Cloud Functions**

```bash
# Editar functions/index.js
cd functions

# Desplegar cambios
firebase deploy --only functions:generateVerse
```

### **Actualizar Secretos**

```bash
# Cambiar API Key de OpenAI
firebase functions:secrets:set OPENAI_API_KEY
# Pegar nueva key

# Re-desplegar función para que use el nuevo secreto
firebase deploy --only functions:generateVerse
```

---

## 📊 Monitoreo y Métricas

### **Firebase Console**

1. **Authentication**:
   - Usuarios registrados
   - Métodos de autenticación activos

2. **Firestore**:
   - Lecturas/Escrituras por día
   - Almacenamiento usado
   - Alertas de límites

3. **Cloud Functions**:
   - Invocaciones por función
   - Tiempo de ejecución promedio
   - Errores (% de fallas)
   - Costo estimado

### **Easypanel Dashboard**

1. **Resources**:
   - CPU Usage
   - RAM Usage
   - Disk Usage

2. **Logs**:
   - Application logs (Nginx)
   - Build logs (Docker)

3. **SSL Certificate**:
   - Estado del certificado
   - Fecha de renovación

---

## 💰 Consideraciones de Costos

### **Firebase (Plan Spark - GRATIS)**

| Recurso | Límite Gratis | Tu App |
|---------|---------------|--------|
| Firestore Reads | 50K/día | ~10-20 por usuario/día |
| Firestore Writes | 20K/día | ~5-10 por usuario/día |
| Cloud Functions Invocations | 125K/mes | ~2-3 por versículo |
| Cloud Functions GB-sec | 40K/mes | ~0.5 por invocación |
| Authentication | Ilimitado | ✅ |

**Estimación**: Soporta ~1,500-2,000 generaciones de versículos/mes gratis.

### **VPS (Easypanel)**

- Depende de tu proveedor (DigitalOcean, Hetzner, etc.)
- Recomendado: 2GB RAM, 1 vCPU (~$5-10/mes)

---

## 🎯 Optimizaciones Avanzadas

### **1. Agregar Dominio Personalizado con SSL**

```bash
# En Easypanel
App → Domains → Add Domain
# Easypanel configura automáticamente:
# - DNS A Record (apunta a tu VPS)
# - SSL Certificate (Let's Encrypt)
# - Auto-renovación cada 90 días
```

### **2. Configurar CI/CD con GitHub Actions**

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Easypanel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Trigger Easypanel webhook
      - name: Deploy to Easypanel
        run: |
          curl -X POST ${{ secrets.EASYPANEL_WEBHOOK_URL }}
```

### **3. Habilitar Caché de CDN (Opcional)**

Para archivos estáticos (JS, CSS, imágenes):

1. Easypanel → App → Settings → CDN
2. O usar Cloudflare como proxy (gratis)

---

## 📝 Resumen de Comandos Útiles

```bash
# ===== FIREBASE =====
# Ver logs de funciones
firebase functions:log --only generateVerse

# Ver secretos configurados
firebase functions:secrets:access OPENAI_API_KEY

# Re-desplegar funciones
firebase deploy --only functions

# ===== GIT =====
# Ver estado del repositorio
git status

# Subir cambios
git add .
git commit -m "mensaje descriptivo"
git push origin main

# ===== LOCAL =====
# Build local para testing
npm install
npm run build
npm run preview  # Probar el build localmente

# Ver variables de entorno
cat .env
```

---

## ✅ Checklist Final de Deploy Exitoso

- [ ] Cloud Functions desplegadas y activas en Firebase
- [ ] Secreto OPENAI_API_KEY configurado
- [ ] Dockerfile y nginx.conf en el repositorio
- [ ] App desplegada en Easypanel con estado "Running"
- [ ] Variables de entorno (Build Args) configuradas
- [ ] Dominio agregado a Firebase Authorized Domains
- [ ] Login con Google funciona
- [ ] Generar versículo funciona y consume tokens
- [ ] Historial de versículos se guarda correctamente
- [ ] Descarga de imágenes funciona
- [ ] Recarga de página (F5) no da error 404
- [ ] SSL activo (candado verde en navegador)

---

## 🎉 ¡Felicidades!

Tu aplicación **YourWordsToMe** está ahora desplegada en producción con:

- ✅ Backend serverless escalable (Firebase)
- ✅ Frontend optimizado con Docker + Nginx
- ✅ SSL automático
- ✅ Dominio personalizado (opcional)
- ✅ CI/CD listo para actualizaciones continuas

**¿Necesitas ayuda?** Revisa la sección de Troubleshooting o los logs de Firebase/Easypanel.
