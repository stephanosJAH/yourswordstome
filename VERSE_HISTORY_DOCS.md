# Documentación: Sistema de Historial de Versículos

## Descripción
Esta feature implementa un sistema completo de historial de versículos generados con soporte para favoritos, utilizando Firestore como backend.

## Estructura de Datos

### Subcolección: `users/{userId}/generated_verses`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `content` | string | El texto del versículo personalizado |
| `reference` | string | Referencia bíblica (ej: "Salmos 23:1") |
| `topic` | string | Tema del versículo (ej: "Ansiedad") |
| `originalText` | string | Texto original del versículo |
| `aiProvider` | string | Proveedor de IA usado |
| `isFavorite` | boolean | Si está marcado como favorito |
| `createdAt` | timestamp | Fecha de creación |

## Archivos Creados

### 1. `src/services/verseHistoryService.js`
Contiene las funciones principales para interactuar con Firestore:

- **`saveVerse(userId, verseData, options)`** - Guarda un versículo generado
- **`toggleFavorite(userId, verseId, currentStatus)`** - Alterna el estado de favorito
- **`deleteVerse(userId, verseId)`** - Elimina un versículo
- **`updateVerseTopic(userId, verseId, newTopic)`** - Actualiza el tema

### 2. `src/hooks/useVersesHistory.js`
Hook de React para obtener y gestionar el historial:

- **`useVersesHistory(userId, options)`** - Hook principal
- **`useFavoriteVerses(userId)`** - Hook simplificado solo para favoritos

## Ejemplos de Uso

### Obtener historial de versículos

```jsx
import { useVersesHistory } from '../hooks/useVersesHistory';
import { useAuth } from '../contexts/AuthContext';

function HistoryPage() {
  const { user } = useAuth();
  const { 
    verses, 
    loading, 
    error, 
    favoritesOnly, 
    setFavoritesOnly,
    toggleFavorite,
    removeVerse 
  } = useVersesHistory(user?.uid);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button onClick={() => setFavoritesOnly(!favoritesOnly)}>
        {favoritesOnly ? 'Ver todos' : 'Ver favoritos'}
      </button>
      
      {verses.map(verse => (
        <div key={verse.id}>
          <h3>{verse.reference}</h3>
          <p>{verse.content}</p>
          <button onClick={() => toggleFavorite(verse.id, verse.isFavorite)}>
            {verse.isFavorite ? '★' : '☆'}
          </button>
          <button onClick={() => removeVerse(verse.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Guardar un versículo manualmente

```jsx
import { saveVerse } from '../services/verseHistoryService';

// Guardar sin actualizar stats (cuando ya se decrementaron tokens)
await saveVerse(userId, {
  content: 'Texto personalizado del versículo',
  reference: 'Juan 3:16',
  topic: 'Fe',
  originalText: 'Texto original',
  aiProvider: 'openai'
});

// Guardar Y actualizar stats (decrementar tokens, incrementar total)
await saveVerse(userId, verseData, { updateStats: true });
```

### Alternar favorito

```jsx
import { toggleFavorite } from '../services/verseHistoryService';

// Marcar/desmarcar como favorito
await toggleFavorite(userId, verseId, currentIsFavorite);
```

## Reglas de Firestore

Las reglas de seguridad se actualizaron para permitir:
- ✅ Lectura solo al propietario
- ✅ Creación solo al propietario
- ✅ Actualización solo al propietario (para toggle favoritos)
- ✅ Eliminación solo al propietario

## Índices de Firestore

Se creó un índice compuesto para soportar consultas de favoritos ordenados por fecha:
- `isFavorite` (ASC) + `createdAt` (DESC)

## Integración con el Generador

El servicio `verseGeneratorService.js` ahora guarda automáticamente cada versículo generado en la nueva estructura `generated_verses`.

## Notas Importantes

1. **Tiempo real**: El hook usa `onSnapshot` para actualizaciones en tiempo real
2. **Paginación**: El hook soporta el parámetro `limitCount` para limitar resultados
3. **Compatibilidad**: Se mantiene la estructura `history` legacy por compatibilidad
