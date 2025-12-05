# 🚀 Guía de Despliegue - Cloud Functions

Esta guía explica cómo desplegar las Cloud Functions para YourSwordsForMe.

## 📋 Prerrequisitos

1. **Firebase CLI** instalado:
   ```bash
   npm install -g firebase-tools
   ```

2. **Proyecto Firebase** con plan Blaze (pago por uso) - requerido para Cloud Functions

3. **Autenticación** con Firebase:
   ```bash
   firebase login
   ```

## 🔧 Configuración Inicial

### 1. Instalar dependencias de Functions

```bash
cd functions
npm install
```

### 2. Configurar el secreto de OpenAI

Las Cloud Functions usan Firebase Secrets para almacenar la API key de OpenAI de forma segura:

```bash
firebase functions:secrets:set OPENAI_API_KEY
```

Cuando te lo pida, ingresa tu API key de OpenAI.

### 3. Verificar configuración

```bash
firebase functions:secrets:access OPENAI_API_KEY
```

## 🚀 Despliegue

### Desplegar todo (Functions + Firestore Rules)

```bash
firebase deploy --only functions,firestore:rules
```

### Desplegar solo Functions

```bash
firebase deploy --only functions
```

### Desplegar solo Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## 🧪 Desarrollo Local

### Iniciar emuladores

```bash
firebase emulators:start --only functions,firestore
```

### Habilitar emulador en el cliente

En `src/config/firebase.js`, descomenta las líneas del emulador:

```javascript
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
firebase functions:log
```

### Ver logs en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a Functions → Logs

## 🔒 Arquitectura de Seguridad

### Flujo de la Función `generateVerse`

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   Cliente React │────▶│   Cloud Function     │────▶│    Firestore    │
│                 │     │   (generateVerse)    │     │                 │
│  • Autenticado  │     │                      │     │                 │
│  • Envía params │     │  1. Verifica auth    │     │                 │
│                 │     │  2. Lee tokens       │◀────│  userData       │
│                 │     │  3. Valida tokens    │     │                 │
│                 │     │  4. Llama Bible API  │     │                 │
│                 │     │  5. Llama OpenAI     │     │                 │
│                 │     │  6. TRANSACCIÓN:     │────▶│  • -1 token     │
│                 │     │     - Decrement token│     │  • +1 generated │
│                 │     │     - Save verse     │     │  • new verse    │
│                 │◀────│  7. Retorna resultado│     │                 │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
```

### Reglas de Firestore

Las reglas están configuradas para:

| Operación | Cliente | Cloud Function |
|-----------|---------|----------------|
| Leer usuario | ✅ (solo propietario) | ✅ |
| Crear usuario | ✅ (con valores iniciales) | ✅ |
| Modificar tokens | ❌ | ✅ |
| Crear versículo | ❌ | ✅ |
| Toggle favorito | ✅ (solo isFavorite) | ✅ |
| Eliminar versículo | ✅ (solo propietario) | ✅ |

## 🐛 Solución de Problemas

### Error: "Missing or insufficient permissions"

1. Verifica que las reglas de Firestore estén desplegadas:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. Verifica que el usuario esté autenticado en el cliente.

### Error: "OPENAI_API_KEY is not defined"

1. Configura el secreto:
   ```bash
   firebase functions:secrets:set OPENAI_API_KEY
   ```

2. Redesplega las funciones:
   ```bash
   firebase deploy --only functions
   ```

### Error: "Billing account not configured"

Las Cloud Functions requieren el plan Blaze de Firebase. Actívalo en la consola de Firebase.

### Error: "Function execution timeout"

La función `generateVerse` puede tardar debido a las llamadas a APIs externas. El timeout por defecto es 60 segundos, lo cual debería ser suficiente.

## 📁 Estructura de Archivos

```
yourswordsforme/
├── functions/
│   ├── index.js          # Cloud Functions
│   ├── package.json      # Dependencias de Node.js
│   └── .eslintrc.js      # Configuración de ESLint
├── firebase.json         # Configuración de Firebase
├── firestore.rules       # Reglas de seguridad
└── src/
    ├── config/
    │   └── firebase.js   # Inicialización (incluye functions)
    └── services/
        └── verseGeneratorService.js  # Cliente que llama a CF
```

## 🔄 Actualización de Funciones

Cuando modifiques `functions/index.js`:

```bash
cd functions
npm install  # Si agregaste nuevas dependencias
firebase deploy --only functions
```

## 💰 Costos Estimados

Con el plan Blaze, los costos son:

- **Cloud Functions**: ~$0.40 por millón de invocaciones
- **Firestore**: ~$0.18 por 100,000 lecturas
- **OpenAI**: Varía según el modelo (gpt-4o-mini es económico)

Para un uso moderado (1000 versículos/mes), el costo estimado es < $5/mes.
