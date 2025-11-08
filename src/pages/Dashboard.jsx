import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateReference } from '../services/bibleService';
import { getVerseGeneratorService } from '../services/verseGeneratorService';
import { hasUnlimitedAccess } from '../services/userService';
import { BookOpen, LogOut, Sparkles, Info } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userData, logout, refreshUserData } = useAuth();
  
  const [verseReference, setVerseReference] = useState('');
  const [temperature, setTemperature] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar si el usuario tiene acceso ilimitado
  const isUnlimited = userData && hasUnlimitedAccess(userData.email);

  // Obtener solo el primer nombre del usuario
  const getFirstName = (fullName) => {
    if (!fullName) return 'amigo';
    return fullName.split(' ')[0];
  };

  const temperatureLabels = {
    literal: 'Literal',
    balanced: 'Balanceado',
    creative: 'Creativo'
  };

  const getTemperatureLabel = (temp) => {
    if (temp < 0.35) return temperatureLabels.literal;
    if (temp <= 0.65) return temperatureLabels.balanced;
    return temperatureLabels.creative;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleGenerate = async () => {
    setError('');

    // Validar referencia
    if (!verseReference.trim()) {
      setError('Por favor ingresa una referencia bíblica');
      return;
    }

    if (!validateReference(verseReference)) {
      setError('Formato de referencia inválido. Ejemplo: Juan 3:16');
      return;
    }

    // Verificar tokens (excepto para usuarios con acceso ilimitado)
    if (!isUnlimited && (!userData || userData.tokens <= 0)) {
      setError('No tienes tokens disponibles');
      return;
    }

    setLoading(true);

    try {
      const verseGenerator = getVerseGeneratorService();
      const result = await verseGenerator.generatePersonalizedVerse({
        userId: user.uid,
        userName: getFirstName(user.displayName),
        verseReference: verseReference.trim(),
        temperature
      });

      if (result.success) {
        // Actualizar datos del usuario
        await refreshUserData();
        
        // Navegar a la página de resultado
        navigate('/result', { 
          state: { 
            verseData: result.data,
            temperature
          } 
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al generar versículo. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="text-accent" size={28} />
              <span className="text-xl font-bold text-primary">YourWordsForMe</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full">
                <Sparkles className="text-accent" size={20} />
                <span className="font-semibold text-accent">
                  {isUnlimited ? '∞' : (userData?.tokens || 0)} tokens
                </span>
                {/* Botón de debug temporal */}
                <button
                  onClick={refreshUserData}
                  className="ml-2 text-xs bg-accent/20 px-2 py-1 rounded hover:bg-accent/30"
                  title="Refrescar tokens"
                >
                  🔄
                </button>
              </div>
              <div className="flex items-center space-x-3">
                {user?.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt={getFirstName(user.displayName)}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <span className="text-gray-700 font-medium hidden md:block">
                  {getFirstName(user?.displayName)}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-3">
              Crea tu Versículo Personalizado
            </h1>
            <p className="text-gray-600">
              Ingresa la referencia de tu versículo favorito y personalízalo con IA
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {/* Input de Referencia */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Referencia Bíblica
              </label>
              <input
                type="text"
                value={verseReference}
                onChange={(e) => setVerseReference(e.target.value)}
                placeholder="Ej: Juan 3:16 o Salmos 23:1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Formato: [Libro] [Capítulo]:[Versículo] (Ej: Juan 14:27, Salmos 23:1-3)
              </p>
            </div>

            {/* Slider de Temperatura */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Nivel de Creatividad
                </label>
                <span className="text-sm font-medium text-accent">
                  {getTemperatureLabel(temperature)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Literal</span>
                <span>Balanceado</span>
                <span>Creativo</span>
              </div>
              <div className="flex items-start space-x-2 mt-3 p-3 bg-blue-50 rounded-lg">
                <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  <strong>Literal:</strong> Más cercano al texto original. 
                  <strong> Balanceado:</strong> Recomendado, equilibrio perfecto. 
                  <strong> Creativo:</strong> Interpretación más libre.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || (!isUnlimited && (!userData || userData.tokens <= 0))}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generar Versículo</span>
                </>
              )}
            </button>

            {/* Info adicional */}
            <div className="text-center text-sm text-gray-500">
              {isUnlimited ? (
                <p>✨ <strong>Acceso ilimitado</strong> - Genera todos los versículos que quieras</p>
              ) : (
                <p>Te quedan <strong>{userData?.tokens || 0}</strong> generaciones gratuitas</p>
              )}
            </div>
          </div>

          {/* Ejemplos */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Referencias populares (garantizadas):
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Juan 3:16', 'Juan 3:17', 'Juan 14:27', 'Salmos 23:1', 'Filipenses 4:13', 'Jeremias 29:11', 'Proverbios 3:5-6', 'Romanos 8:28'].map((ref) => (
                <button
                  key={ref}
                  onClick={() => setVerseReference(ref)}
                  disabled={loading}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
