# Guía de Service Account de Firebase

## 🔐 Archivo de Service Account

**Archivo:** `yourswordsforme-firebase-adminsdk-fbsvc-bc5cd64454.json`

Este archivo contiene las credenciales de administrador para acceder a Firebase desde el backend (si decides usarlo en el futuro).

## ⚠️ IMPORTANTE - Seguridad

### ✅ El archivo YA está protegido:
- Incluido en `.gitignore`
- NO se subirá a Git/GitHub
- NO se compartirá públicamente

### ❌ NUNCA hacer:
- ❌ Subir este archivo a GitHub o cualquier repositorio público
- ❌ Compartir este archivo por email o chat
- ❌ Incluir su contenido en el código fuente
- ❌ Exponerlo en el frontend

## 📋 Cuándo Usar el Service Account

### Actualmente: NO SE USA
Tu MVP actual NO necesita el Service Account porque:
- Todo se ejecuta desde el frontend
- Firebase Authentication maneja el login
- Firestore usa reglas de seguridad del cliente

### Futuro: Cuándo SÍ usarlo
Cuando implementes backend (Cloud Functions o servidor propio):

1. **Cloud Functions (Firebase)**
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./path/to/serviceAccountKey.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   ```

2. **Servidor Node.js (Express, etc.)**
   - Para operaciones administrativas
   - Gestión de usuarios
   - Operaciones de Firestore que requieren privilegios de admin

## 🔄 Si Necesitas Regenerar el Service Account

1. Ve a Firebase Console
2. Project Settings → Service Accounts
3. Clic en "Generate new private key"
4. Descarga el nuevo archivo JSON
5. Elimina el archivo viejo
6. Actualiza el nombre en `.gitignore` si es necesario

## 📁 Dónde Guardarlo (Producción)

### Opción 1: Variables de Entorno (Recomendado)
No subas el archivo JSON, usa variables de entorno:

```javascript
// En lugar de require('./serviceAccount.json')
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};
```

### Opción 2: Secret Manager (Cloud)
- Google Cloud Secret Manager
- AWS Secrets Manager
- Azure Key Vault
- Vercel Environment Variables (encriptadas)

## 🧪 Testing Local con Service Account

Si necesitas probar funciones de admin localmente:

1. Asegúrate que el archivo esté en la raíz del proyecto
2. Nunca hagas `git add` de este archivo
3. Usa solo en tu máquina local
4. Para deploy, usa variables de entorno

## 📝 Contenido del Service Account

El archivo contiene (NO compartas estos valores):
- `project_id`: ID de tu proyecto Firebase
- `private_key`: Clave privada RSA
- `client_email`: Email del service account
- `client_id`: ID del cliente
- Otros datos de autenticación

## ✅ Verificación de Seguridad

Para confirmar que está protegido:

```powershell
# Verificar que está en .gitignore
git status

# NO debería aparecer en la lista de archivos a commitear
# Si aparece, ejecuta:
git rm --cached yourswordsforme-firebase-adminsdk-fbsvc-bc5cd64454.json
```

## 🚀 Resumen

- ✅ **Archivo protegido** en `.gitignore`
- ✅ **No se necesita** para tu MVP actual
- ✅ **Úsalo solo** si implementas backend en el futuro
- ✅ **Guárdalo** de forma segura (variables de entorno en producción)

---

**Última actualización:** 8 de noviembre de 2025
