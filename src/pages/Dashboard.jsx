import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateReference } from '../services/bibleService';
import { getVerseGeneratorService } from '../services/verseGeneratorService';
import { hasUnlimitedAccess } from '../services/userService';
import { BookOpen, LogOut, Sparkles, Info, Users, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import CustomNameModal from '../components/CustomNameModal';
import ClassicStyle from '../components/visual/ClassicStyle';
import ModernStyle from '../components/visual/ModernStyle';
import InspirationalStyle from '../components/visual/InspirationalStyle';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userData, logout, refreshUserData } = useAuth();
  
  const [verseReference, setVerseReference] = useState('');
  const [temperature, setTemperature] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState(null);
  const [verseData, setVerseData] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef(null);

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
        
        // Guardar datos del versículo con View Transition y hacer scroll a la sección de resultado
        withViewTransition(() => {
          setVerseData(result.data);
        });
        
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
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
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-light-text">YourWordsForMe</h1>
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

        {/* section result */}
        <div id="result-section" className="min-h-screen max-w-4xl w-full mx-auto flex items-center justify-center py-16">
          {verseData ? (
            <div className="w-full">
              {/* Style Selector */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 text-center px-4">
                  Selecciona un Estilo
                </h2>
                <div className="flex justify-center flex-wrap gap-2.5 sm:gap-4 px-4">
                  {[
                    { id: 'classic', name: 'Clásico', component: ClassicStyle },
                    { id: 'modern', name: 'Moderno', component: ModernStyle },
                    { id: 'inspirational', name: 'Inspiracional', component: InspirationalStyle }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                        selectedStyle === style.id
                          ? 'bg-primary text-white shadow-lg scale-105'
                          : 'bg-white/60 backdrop-blur-sm text-light-text hover:bg-white border border-gray-200/80'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 border border-gray-200/80">
                <div className="flex justify-center overflow-x-auto">
                  <div ref={canvasRef} className="inline-block">
                    {selectedStyle === 'classic' && (
                      <ClassicStyle
                        personalizedText={verseData.personalizedText}
                        reference={verseData.reference}
                        userName={getFirstName(user?.displayName)}
                      />
                    )}
                    {selectedStyle === 'modern' && (
                      <ModernStyle
                        personalizedText={verseData.personalizedText}
                        reference={verseData.reference}
                        userName={getFirstName(user?.displayName)}
                      />
                    )}
                    {selectedStyle === 'inspirational' && (
                      <InspirationalStyle
                        personalizedText={verseData.personalizedText}
                        reference={verseData.reference}
                        userName={getFirstName(user?.displayName)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button
                  onClick={async () => {
                    setDownloading(true);
                    try {
                      const element = canvasRef.current;
                      const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: null
                      });
                      canvas.toBlob((blob) => {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        const fileName = `versiculo-${verseData.reference.replace(/\s+/g, '-')}-${Date.now()}.png`;
                        link.download = fileName;
                        link.href = url;
                        link.click();
                        URL.revokeObjectURL(url);
                        setDownloading(false);
                      });
                    } catch (error) {
                      console.error('Error al descargar:', error);
                      alert('Error al generar la imagen. Por favor intenta de nuevo.');
                      setDownloading(false);
                    }
                  }}
                  disabled={downloading}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/40 text-sm sm:text-base"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Descargar Imagen</span>
                    </>
                  )}
                </button>
                {navigator.share && (
                  <button
                    onClick={async () => {
                      try {
                        const element = canvasRef.current;
                        const canvas = await html2canvas(element, {
                          scale: 2,
                          useCORS: true,
                          backgroundColor: null
                        });
                        canvas.toBlob(async (blob) => {
                          const file = new File([blob], 'versiculo.png', { type: 'image/png' });
                          await navigator.share({
                            files: [file],
                            title: verseData.reference,
                            text: verseData.personalizedText
                          });
                        });
                      } catch (error) {
                        console.error('Error al compartir:', error);
                      }
                    }}
                    className="flex-1 bg-white/60 backdrop-blur-sm border-2 border-gray-300 text-light-text hover:bg-white font-semibold py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Share2 size={18} className="sm:w-5 sm:h-5" />
                    <span>Compartir</span>
                  </button>
                )}
              </div>

              {/* Original Text Reference */}
              <div className="p-4 sm:p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200/50">
                <h3 className="text-xs sm:text-sm font-semibold text-light-text mb-2">
                  Texto Original:
                </h3>
                <p className="text-sm sm:text-base text-gray-600 italic mb-2">
                  "{verseData.originalText}"
                </p>
                <p className="text-xs sm:text-sm text-light-subtle">
                  — {verseData.reference} ({verseData.translation})
                </p>
              </div>

              {/* Botón para generar otro */}
              <div className="text-center mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/60 backdrop-blur-sm border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all text-sm sm:text-base"
                >
                  Generar Otro Versículo
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-light-subtle px-4">
              <Sparkles size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary/30" />
              <p className="text-base sm:text-lg">Genera un versículo para ver el resultado aquí</p>
            </div>
          )}
        </div>

        {/* section footer */}
        <footer className="w-full bg-gradient-to-t from-primary/5 to-transparent border-t border-gray-200/50 py-8 sm:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Columna 1 - Sobre el proyecto */}
              <div className="text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">YourWordsForMe</h3>
                <p className="text-xs sm:text-sm text-light-subtle leading-relaxed px-4 md:px-0">
                  Personaliza versículos bíblicos con IA y compártelos con tus seres queridos.
                </p>
              </div>
              
              {/* Columna 2 - Enlaces */}
              <div className="text-center">
                <h4 className="text-sm sm:text-base font-semibold text-light-text mb-2 sm:mb-3">Enlaces</h4>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-light-subtle">
                  <li>
                    <Link to="/about" className="hover:text-primary transition-colors">Acerca de</Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:text-primary transition-colors">Privacidad</Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-primary transition-colors">Términos de uso</Link>
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
                © {new Date().getFullYear()} YourWordsForMe. Todos los derechos reservados.
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
