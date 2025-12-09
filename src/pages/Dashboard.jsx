import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateReference } from '../services/bibleService';
import { getVerseGeneratorService } from '../services/verseGeneratorService';
import { hasUnlimitedAccess } from '../services/userService';
import { useVersesHistory } from '../hooks/useVersesHistory';
import { LogOut, Sparkles, Info, Users, Heart, BookOpen, Trash2, Clock } from 'lucide-react';
import CustomNameModal from '../components/CustomNameModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userData, logout, refreshUserData } = useAuth();
  
  const [verseReference, setVerseReference] = useState('');
  const [temperature, setTemperature] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState(null);

  // Hook para obtener versículos generados
  const { 
    verses, 
    loading: versesLoading, 
    toggleFavorite, 
    removeVerse,
    favoritesOnly,
    setFavoritesOnly 
  } = useVersesHistory(user?.uid);

  // Verificar si el usuario tiene acceso ilimitado
  const isUnlimited = userData && hasUnlimitedAccess(userData.email);

  // Obtener solo el primer nombre del usuario
  const getFirstName = (fullName) => {
    if (!fullName) return 'amigo';
    return fullName.split(' ')[0];
  };

  // Helper para View Transitions
  const withViewTransition = (callback) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => callback());
    } else {
      callback();
    }
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmCustomName = (name) => {
    setCustomName(name);
    setIsModalOpen(false);
    handleGenerate(name);
  };

  const handleGenerate = async (nameOverride = null) => {
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
      const nameToUse = nameOverride || getFirstName(user.displayName);
      const result = await verseGenerator.generatePersonalizedVerse({
        userId: user.uid,
        userName: nameToUse,
        verseReference: verseReference.trim(),
        temperature
      });

      if (result.success) {
        // Actualizar datos del usuario
        await refreshUserData();
        
        // Navegar a la página de resultado con los datos y el verseId
        navigate('/result', { 
          state: { 
            verseData: result.data,
            verseId: result.data.verseId,
            isFavorite: false // Nuevo versículo, no es favorito
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="background-gradient fixed inset-0 z-0"></div>
      <div className="ethereal-blur fixed inset-0 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full px-4 sm:px-8 py-4 sm:py-6">
          <div className="container mx-auto flex justify-between items-center flex-wrap gap-3 sm:gap-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-light-text">YourWordsToMe</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm font-medium text-light-subtle hidden sm:inline">Hola, {getFirstName(user?.displayName)}!</span>
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-primary/10 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <Sparkles className="text-primary" size={16} />
                <span className="font-semibold text-primary text-xs sm:text-base">
                  {isUnlimited ? '∞' : (userData?.tokens || 0)}
                </span>
                <span className="text-xs sm:text-sm text-primary hidden sm:inline">tokens</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/60 backdrop-blur-sm border border-gray-200/80 text-light-text hover:bg-white font-semibold py-2 px-3 sm:px-5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                title="Cerrar sesión"
              >
                <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline text-sm">Salir</span>
              </button>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 -mt-10">

        {/* section generate */}
        <div id="generate-section" className="min-h-screen max-w-2xl w-full mx-auto flex flex-col items-center justify-center py-8">

          {/* Jumbotron */}
          <div className="text-center mb-8 sm:mb-12 mt-8 sm:mt-14 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 leading-tight">
              Hola <span className="italic text-accent font-normal text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Playfair Display' }}>{getFirstName(user?.displayName)}</span>, genera tu versículo personalizado
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Ingresa la referencia de tu versículo favorito y personalízalo con IA
            </p>
          </div>

          {/* Formulario */}
          <div className="w-full p-1.5 sm:p-2 bg-white/50 backdrop-blur-md border border-gray-200/80 rounded-large shadow-lg">
            <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-6">
              {/* Input de Referencia */}
              <div>
                <label className="sr-only" htmlFor="verse-reference">
                  Referencia Bíblica
                </label>
                <input
                  id="verse-reference"
                  type="text"
                  value={verseReference}
                  onChange={(e) => setVerseReference(e.target.value)}
                  placeholder="Ej: Juan 3:16 o Salmos 23:1"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-100/80 border-transparent rounded-xl text-light-text placeholder-light-subtle focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 text-base sm:text-lg outline-none"
                  disabled={loading}
                />
                <p className="text-xs text-light-subtle mt-2 px-1">
                  Formato: [Libro] [Capítulo]:[Versículo] (Ej: Juan 14:27, Salmos 23:1-3)
                </p>
              </div>              {/* Slider de Temperatura */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-light-text">
                    Nivel de Creatividad
                  </label>
                  <span className="text-sm font-medium text-primary">
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
                  className="w-full accent-primary"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-light-subtle mt-2">
                  <span>Literal</span>
                  <span>Balanceado</span>
                  <span>Creativo</span>
                </div>
                <div className="flex items-start space-x-2 mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200/50">
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
                <div className="bg-red-50/50 border border-red-200/50 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}              {/* Generate Buttons */}
              <div className="space-y-2.5 sm:space-y-3">
                <button
                  onClick={() => handleGenerate()}
                  disabled={loading || (!isUnlimited && (!userData || userData.tokens <= 0))}
                  className="w-full bg-primary text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="sm:w-5 sm:h-5" />
                      <span>Personalizar con IA</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleOpenModal}
                  disabled={loading || (!isUnlimited && (!userData || userData.tokens <= 0))}
                  className="w-full bg-white border-2 border-gray-300 text-light-text hover:bg-gray-50 font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Users size={18} className="sm:w-5 sm:h-5" />
                  <span>Generar para otra persona</span>
                </button>
              </div>

              {/* Info adicional */}
              <div className="text-center text-sm text-light-subtle">
                {isUnlimited ? (
                  <p>✨ <strong>Acceso ilimitado</strong> - Genera todos los versículos que quieras</p>
                ) : (
                  <p>Te quedan <strong>{userData?.tokens || 0}</strong> generaciones gratuitas</p>
                )}
              </div>
            </div>
          </div>

          {/* Ejemplos */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/40 backdrop-blur-sm rounded-lg border border-gray-200/50">
            <h3 className="text-xs sm:text-sm font-semibold text-light-text mb-2.5 sm:mb-3">
              Referencias populares:
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {['Juan 3:16', 'Juan 3:17', 'Juan 14:27', 'Salmos 23:1', 'Filipenses 4:13', 'Jeremias 29:11', 'Proverbios 3:5-6', 'Romanos 8:28'].map((ref) => (
                <button
                  key={ref}
                  onClick={() => setVerseReference(ref)}
                  disabled={loading}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-300 rounded-full text-xs sm:text-sm hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* section favorites */}
        <div id="favorites-section" className="max-w-4xl w-full mx-auto py-16 px-4">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4 sm:mb-6">
              <Heart size={32} className="sm:w-10 sm:h-10 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">
              {favoritesOnly ? 'Mis Versículos Favoritos' : 'Mis Versículos Generados'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-4">
              {favoritesOnly 
                ? 'Tus versículos guardados como favoritos' 
                : 'Todos tus versículos personalizados'}
            </p>
            
            {/* Toggle Favoritos / Todos */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setFavoritesOnly(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !favoritesOnly 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  Todos
                </span>
              </button>
              <button
                onClick={() => setFavoritesOnly(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  favoritesOnly 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart size={16} />
                  Favoritos
                </span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {versesLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando versículos...</p>
            </div>
          )}

          {/* Empty State */}
          {!versesLoading && verses.length === 0 && (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-200/80">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mb-6">
                  <BookOpen size={36} className="sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-light-text mb-3">
                  {favoritesOnly 
                    ? 'Aún no tienes versículos favoritos' 
                    : 'Aún no has generado versículos'}
                </h3>
                <p className="text-sm sm:text-base text-light-subtle mb-6 max-w-sm mx-auto">
                  {favoritesOnly 
                    ? 'Marca versículos como favoritos para verlos aquí' 
                    : 'Genera tu primer versículo personalizado'}
                </p>
                <button
                  onClick={() => {
                    document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all text-sm sm:text-base shadow-lg hover:shadow-primary/40"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={18} />
                    Generar versículo
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Grid de versículos */}
          {!versesLoading && verses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {verses.slice(0, 6).map((verse) => (
                <div 
                  key={verse.id} 
                  onClick={() => navigate('/result', { 
                    state: { 
                      verseData: {
                        reference: verse.verseReference,
                        originalText: verse.originalText,
                        personalizedText: verse.personalizedText,
                        translation: verse.translation
                      },
                      verseId: verse.id,
                      isFavorite: verse.isFavorite
                    } 
                  })}
                  className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-200/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                >
                  {/* Header con referencia y acciones */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {verse.verseReference}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(verse.id, verse.isFavorite);
                        }}
                        className={`p-2 rounded-full transition-all ${
                          verse.isFavorite 
                            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title={verse.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        <Heart size={18} fill={verse.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('¿Estás seguro de eliminar este versículo?')) {
                            removeVerse(verse.id);
                          }
                        }}
                        className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Eliminar versículo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Texto personalizado */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-4">
                    {verse.personalizedText || verse.originalText}
                  </p>
                  
                  {/* Footer con fecha */}
                  <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-100">
                    <span>
                      {verse.createdAt instanceof Date 
                        ? verse.createdAt.toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Fecha no disponible'
                      }
                    </span>
                    <span className="text-primary font-medium group-hover:translate-x-1 transition-transform duration-300">
                      Ver más →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* section footer */}
        <footer className="w-full bg-gradient-to-t from-primary/5 to-transparent border-t border-gray-200/50 py-8 sm:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Columna 1 - Sobre el proyecto */}
              <div className="text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">YourWordsToMe</h3>
                <p className="text-xs sm:text-sm text-light-subtle leading-relaxed px-4 md:px-0">
                  Personaliza versículos bíblicos con IA y compártelos con tus seres queridos.
                </p>
              </div>
              
              {/* Columna 2 - Enlaces */}
              <div className="text-center">
                <h4 className="text-sm sm:text-base font-semibold text-light-text mb-2 sm:mb-3">Enlaces</h4>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-light-subtle">
                  <li>
                    <Link 
                      to="/about" 
                      className="hover:text-primary transition-colors"
                      style={{ viewTransitionName: 'page-title-about' }}
                    >
                      Acerca de
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/privacy" 
                      className="hover:text-primary transition-colors"
                      style={{ viewTransitionName: 'page-title-privacy' }}
                    >
                      Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/terms" 
                      className="hover:text-primary transition-colors"
                      style={{ viewTransitionName: 'page-title-terms' }}
                    >
                      Términos de uso
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Columna 3 - Contacto */}
              <div className="text-center md:text-right">
                <h4 className="text-sm sm:text-base font-semibold text-light-text mb-2 sm:mb-3">Contacto</h4>
                <p className="text-xs sm:text-sm text-light-subtle mb-1">
                  ¿Preguntas o sugerencias?
                </p>
                <a href="mailto:support@yourswordsforme.com" className="text-xs sm:text-sm text-primary hover:text-primary-dark transition-colors break-all">
                  support@yourswordsforme.com
                </a>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="pt-4 sm:pt-6 border-t border-gray-200/50 text-center">
              <p className="text-xs sm:text-sm text-light-subtle">
                © {new Date().getFullYear()} YourWordsToMe. Todos los derechos reservados.
              </p>
              <p className="text-xs text-light-subtle mt-1.5 sm:mt-2">
                Hecho con ❤️ para compartir la Palabra de Dios
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Modal de nombre personalizado */}
      <CustomNameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCustomName}
      />
      </div>
    </div>
  );
};
  
  export default Dashboard;
