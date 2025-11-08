# YourWordsForMe - Versículos Bíblicos Personalizados

Aplicación web que permite generar versículos bíblicos personalizados usando IA.

## Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Autenticación**: Firebase Authentication
- **Base de Datos**: Cloud Firestore
- **IA**: OpenAI API (ChatGPT) - Arquitectura preparada para múltiples proveedores
- **Bible API**: scripture.api.bible (7 traducciones en español disponibles)
- **Generación de Imágenes**: html2canvas
- **Routing**: React Router v6

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` basado en `.env.example` y agregar:
   - Credenciales de Firebase
   - OpenAI API Key
   - Bible API Key (gratis en https://scripture.api.bible/signup)

4. Ejecutar en desarrollo:
```bash
npm run dev
```

## Configuración

### 1. Firebase
1. Crear proyecto en Firebase Console
2. Habilitar Authentication con Google
3. Crear base de datos Firestore
4. Copiar configuración al archivo `.env`

### 2. Bible API (scripture.api.bible)
1. Regístrate gratis en: https://scripture.api.bible/signup
2. Obtén tu API Key en: https://scripture.api.bible/admin/applications
3. Agrégala al `.env` como `VITE_BIBLE_API_KEY`
4. **Ver guía completa:** [BIBLE_API_GUIDE.md](./BIBLE_API_GUIDE.md)

**Traducciones disponibles:**
- Reina Valera 1909 (por defecto)
- Nueva Biblia Viva 2008
- Palabla de Dios para ti
- Versión Biblia Libre
- Y más...

### 3. OpenAI API
1. Obtén tu API Key en: https://platform.openai.com/api-keys
2. Agrégala al `.env` como `VITE_OPENAI_API_KEY`

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── verse/          # Componentes relacionados con versículos
│   └── visual/         # Componentes de visualización
├── contexts/           # Contextos de React
├── services/           # Servicios (Firebase, IA, Bible API)
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── utils/              # Utilidades
└── config/             # Configuración
```

## Características

- ✅ Autenticación con Google
- ✅ Sistema de tokens (5 gratuitos)
- ✅ Generación de versículos personalizados con IA
- ✅ 3 estilos visuales prediseñados
- ✅ Descarga de imágenes en alta resolución
- ✅ Arquitectura flexible para múltiples proveedores de IA

## Deployment

```bash
npm run build
```

Deploy a Vercel o cualquier servicio de hosting estático.
