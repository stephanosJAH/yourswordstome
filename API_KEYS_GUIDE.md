# YourWordsForMe - Configuración de API Keys

## Opciones para Manejar API Keys

### Opción 1: Variables de Entorno (Recomendado para MVP)

Agregar al archivo `.env`:

```env
VITE_OPENAI_API_KEY=sk-proj-...
```

**Pros:**
- Simple y rápido
- Bueno para MVP y testing

**Contras:**
- La API key queda expuesta en el frontend
- Usuario no puede usar su propia key

### Opción 2: Input de Usuario (Alternativa sin backend)

Permitir que el usuario ingrese su propia API key de OpenAI.

**Implementación:**

1. Agregar campo de input en Dashboard:

```jsx
const [apiKey, setApiKey] = useState('');

<input
  type="password"
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value)}
  placeholder="Ingresa tu API key de OpenAI"
/>
```

2. Pasar API key al servicio:

```javascript
const verseGenerator = new VerseGeneratorService('openai', apiKey);
```

**Pros:**
- Usuario usa sus propios créditos
- Sin costos para el desarrollador

**Contras:**
- Fricción adicional para el usuario
- API key aún expuesta en el navegador

### Opción 3: Proxy Backend (Más Seguro - Post-MVP)

Crear un backend simple (Cloud Functions, Vercel Functions, etc.) que maneje las llamadas a OpenAI.

**Flujo:**
1. Frontend llama a tu backend
2. Backend llama a OpenAI con tu API key
3. Backend retorna resultado al frontend

**Pros:**
- API key segura
- Control total sobre uso
- Posibilidad de monetizar

**Contras:**
- Requiere backend adicional
- Más complejo

## Recomendación para MVP

**Usar Opción 1** (variables de entorno) para desarrollo y testing.

Luego migrar a **Opción 3** (proxy backend) antes de lanzamiento público.

## Costos Estimados de OpenAI

### GPT-4
- ~$0.03 por cada 1K tokens input
- ~$0.06 por cada 1K tokens output
- **Costo por generación**: ~$0.002 - $0.005

### GPT-3.5-turbo (Alternativa más económica)
- ~$0.0005 por cada 1K tokens input
- ~$0.0015 por cada 1K tokens output
- **Costo por generación**: ~$0.0003 - $0.001

### Para 100 usuarios con 5 generaciones cada uno:
- GPT-4: ~$1.00 - $2.50
- GPT-3.5: ~$0.15 - $0.50

## Configuración de Límites

Para proteger tu API key, configura límites en OpenAI Dashboard:

1. Ir a [OpenAI Platform → Usage limits](https://platform.openai.com/account/limits)
2. Configurar:
   - **Hard limit**: $10/mes (ajustar según necesidad)
   - **Soft limit**: $5/mes (notificación)
   - **Rate limiting**: Activar

## Alternativas de IA Gratuitas (Para Testing)

Si quieres probar sin costos:

1. **Hugging Face Inference API** (gratis con limitaciones)
2. **Google Gemini API** (tier gratuito disponible)
3. **Cohere** (tier gratuito disponible)

## Implementación de Proxy Backend (Futuro)

### Ejemplo con Vercel Functions:

```javascript
// api/generate-verse.js
export default async function handler(req, res) {
  const { verseText, userName, temperature } = req.body;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature
    })
  });
  
  const data = await response.json();
  res.json(data);
}
```

En frontend, llamar:

```javascript
const response = await fetch('/api/generate-verse', {
  method: 'POST',
  body: JSON.stringify({ verseText, userName, temperature })
});
```
