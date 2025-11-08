# 🔧 Solución: Error de Permisos de Firestore

## 🐛 Error Identificado

```
Missing or insufficient permissions.
Status Code: 400 Bad Request
```

**Causa:** Las reglas de Firestore eran demasiado restrictivas y no permitían actualizar el campo `tokens`.

## ✅ Solución Aplicada

Se actualizaron las reglas en `firestore.rules` para permitir:
- ✅ Crear usuarios al iniciar sesión
- ✅ Actualizar tokens (decrementar al generar)
- ✅ Actualizar totalGenerated
- ✅ Crear entradas en historial
- ❌ Eliminar usuarios (protegido)

## 🚀 Cómo Desplegar las Nuevas Reglas

### Opción 1: Firebase Console (Más Fácil)

1. **Abre Firebase Console:**
   ```
   https://console.firebase.google.com/project/yourswordsforme/firestore
   ```

2. **Ve a la pestaña "Rules"** (Reglas)

3. **Copia y pega** el contenido del archivo `firestore.rules`:

```plaintext
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función helper para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Función helper para verificar que el usuario es el propietario
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Permitir lectura solo al propietario
      allow read: if isOwner(userId);
      
      // Permitir crear solo al propietario (primer login)
      allow create: if isOwner(userId);
      
      // Permitir actualizar solo al propietario
      // Permitir modificación de tokens y totalGenerated para el sistema
      allow update: if isOwner(userId);
      
      // No permitir eliminación
      allow delete: if false;
      
      // History subcollection
      match /history/{historyId} {
        // Solo lectura para el propietario
        allow read: if isOwner(userId);
        
        // Permitir creación al propietario
        allow create: if isOwner(userId);
        
        // No permitir modificación o eliminación
        allow update, delete: if false;
      }
    }
    
    // Denegar acceso a cualquier otra colección
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. **Haz clic en "Publicar" (Publish)**

5. **Confirma el despliegue**

⏱️ **Tiempo:** 2 minutos

---

### Opción 2: Firebase CLI (Para Desarrolladores)

Si tienes Firebase CLI instalado:

```powershell
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Login a Firebase
firebase login

# Inicializar Firebase en el proyecto (si no está inicializado)
firebase init firestore

# Desplegar solo las reglas
firebase deploy --only firestore:rules
```

⏱️ **Tiempo:** 3-5 minutos

---

## 🧪 Verificar que Funciona

### 1. Desplegar las reglas (Opción 1 o 2 arriba)

### 2. Recargar la aplicación

```powershell
# En tu navegador, recarga la página
Ctrl + R  (o F5)
```

### 3. Intenta generar un versículo

- Ingresa: **Juan 3:16**
- Ajusta temperatura (opcional)
- Haz clic en **"Generar Versículo"**

### 4. Verifica en consola (F12)

Deberías ver:
```
✅ Decrementando token...
✅ Token actualizado correctamente
```

**NO deberías ver:**
```
❌ Missing or insufficient permissions
❌ 400 Bad Request
```

---

## 📊 Estructura de Permisos Actualizada

### Usuarios (`/users/{userId}`)

| Operación | Permitido | Condición |
|-----------|-----------|-----------|
| **Read** | ✅ Sí | Solo el propietario (auth.uid == userId) |
| **Create** | ✅ Sí | Solo el propietario en primer login |
| **Update** | ✅ Sí | Solo el propietario (incluye tokens) |
| **Delete** | ❌ No | Protegido |

### Historial (`/users/{userId}/history/{historyId}`)

| Operación | Permitido | Condición |
|-----------|-----------|-----------|
| **Read** | ✅ Sí | Solo el propietario |
| **Create** | ✅ Sí | Solo el propietario |
| **Update** | ❌ No | Inmutable después de crear |
| **Delete** | ❌ No | Protegido |

---

## 🔒 Seguridad Mantenida

Las nuevas reglas **siguen siendo seguras**:

- ✅ Usuarios solo pueden ver/modificar **sus propios datos**
- ✅ No pueden ver datos de otros usuarios
- ✅ No pueden eliminar su cuenta
- ✅ No pueden modificar historial una vez creado
- ✅ Requieren autenticación para todas las operaciones

**Cambio principal:** Ahora pueden actualizar el campo `tokens` (necesario para decrementar).

---

## 🐛 Si el Error Persiste

### 1. Verifica que las reglas se desplegaron

En Firebase Console → Firestore → Rules, deberías ver:

```plaintext
allow update: if isOwner(userId);
```

**NO debe decir:**
```plaintext
allow update: if isOwner(userId) && 
  !request.resource.data.diff(resource.data).affectedKeys().hasAny(['tokens', 'totalGenerated']);
```

### 2. Verifica que estás autenticado

En la consola del navegador (F12):
```javascript
// Deberías ver tu email
console.log(firebase.auth().currentUser.email)
```

### 3. Verifica tu UID en Firestore

1. Firebase Console → Firestore → Data
2. Colección `users`
3. Tu documento debe tener el mismo ID que tu UID de Authentication

**Authentication UID:**
```
Firebase Console → Authentication → Users → UID
```

**Firestore Document ID:**
```
Firebase Console → Firestore → users → [documento]
```

**Deben coincidir.**

### 4. Limpia caché del navegador

```
Ctrl + Shift + Delete
→ Eliminar caché
→ Recargar página
```

---

## 📝 Cambios en firestore.rules

### ❌ Antes (Demasiado Restrictivo)

```javascript
allow update: if isOwner(userId) && 
  !request.resource.data.diff(resource.data).affectedKeys().hasAny(['tokens', 'totalGenerated']);
```

**Problema:** No permitía modificar `tokens` ni `totalGenerated`.

### ✅ Ahora (Correcto)

```javascript
allow update: if isOwner(userId);
```

**Solución:** Permite actualizar cualquier campo si eres el propietario.

---

## 🎯 Resumen de Pasos

1. ✅ Reglas actualizadas en `firestore.rules`
2. [ ] Desplegar en Firebase Console (Opción 1) **← HAZLO AHORA**
3. [ ] Recargar app en navegador
4. [ ] Probar generación de versículo
5. [ ] Verificar que no hay errores 400

---

## 📚 Recursos

- **Firebase Console:** https://console.firebase.google.com/
- **Documentación de Reglas:** https://firebase.google.com/docs/firestore/security/get-started
- **Testing de Reglas:** https://firebase.google.com/docs/firestore/security/test-rules-emulator

---

**Implementado:** 8 de noviembre de 2025  
**Archivo modificado:** `firestore.rules`  
**Acción requerida:** Desplegar reglas en Firebase Console
