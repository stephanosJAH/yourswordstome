import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasUnlimitedAccess } from '../services/userService';
import { toggleFavorite } from '../services/verseHistoryService';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, Share2, Sparkles, LogOut, Copy, Check, Heart } from 'lucide-react';
import ClassicStyle from '../components/visual/ClassicStyle';
import ModernStyle from '../components/visual/ModernStyle';
import InspirationalStyle from '../components/visual/InspirationalStyle';

// Datos de prueba para desarrollo
const DUMP_VERSE_DATA = {
  personalizedText: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna. Este mensaje es especialmente para ti, que en cada amanecer encuentras una nueva oportunidad de experimentar Su amor infinito.",
  originalText: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
  reference: "Juan 3:16",
  translation: "RVR1960"
};

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  const canvasRef = useRef(null);

  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  // Usar datos del state o datos de prueba para desarrollo
  const verseData = location.state?.verseData || DUMP_VERSE_DATA;
  const verseId = location.state?.verseId || null;
  
  // Verificar si el usuario tiene acceso ilimitado
  const isUnlimited = userData && hasUnlimitedAccess(userData.email);

  // Inicializar estado de favorito desde location.state
  useEffect(() => {
    if (location.state?.isFavorite !== undefined) {
      setIsFavorite(location.state.isFavorite);
    }
  }, [location.state?.isFavorite]);

  // Manejar toggle de favorito
  const handleToggleFavorite = async () => {
    if (!user?.uid || !verseId) {
      console.warn('No se puede marcar favorito: falta userId o verseId');
      return;
    }
    
    setTogglingFavorite(true);
    try {
      await toggleFavorite(user.uid, verseId, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al marcar favorito:', error);
    } finally {
      setTogglingFavorite(false);
    }
  };

  // Obtener solo el primer nombre del usuario
  const getFirstName = (fullName) => {
    if (!fullName) return 'amigo';
    return fullName.split(' ')[0];
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Comentado temporalmente para desarrollo - descomentar en producción
  // React.useEffect(() => {
  //   if (!verseData) {
  //     navigate('/dashboard');
  //   }
  // }, [verseData, navigate]);

  // if (!verseData) return null;

  const styles = [
    { id: 'classic', name: 'Clásico', component: ClassicStyle },
    { id: 'modern', name: 'Moderno', component: ModernStyle },
    { id: 'inspirational', name: 'Inspiracional', component: InspirationalStyle }
  ];

  const SelectedStyleComponent = styles.find(s => s.id === selectedStyle)?.component;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = canvasRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Alta resolución
        useCORS: true,
        backgroundColor: null
      });

      // Convertir a blob y descargar
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
  };

  const handleShare = async () => {
    // Web Share API (si está disponible)
    if (navigator.share) {
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
    }
  };

  const handleCopyText = async () => {
    const appUrl = window.location.origin;
    const textToCopy = `"${verseData.personalizedText}"\n\n— ${verseData.reference}\n\n✨ Genera tu versículo personalizado en: ${appUrl}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
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
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-light-text hover:text-primary transition-colors mr-4"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Volver</span>
              </button>
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
        <main className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Style Selector */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 text-center">
                Selecciona un Estilo
              </h2>
              <div className="flex justify-center flex-wrap gap-2.5 sm:gap-4">
                {styles.map((style) => (
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
                  {SelectedStyleComponent && (
                    <SelectedStyleComponent
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
              {/* Botón Favorito */}
              {verseId && (
                <button
                  onClick={handleToggleFavorite}
                  disabled={togglingFavorite}
                  className={`flex-1 sm:flex-none font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
                    isFavorite
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/40'
                      : 'bg-white/60 backdrop-blur-sm border-2 border-red-300 text-red-500 hover:bg-red-50'
                  }`}
                  title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  <span className="sm:hidden">{isFavorite ? 'Favorito' : 'Agregar'}</span>
                </button>
              )}
              
              <button
                onClick={handleDownload}
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
              
              {/* Botón Compartir - Solo visible en mobile cuando Web Share API está disponible */}
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="flex-1 sm:hidden bg-white/60 backdrop-blur-sm border-2 border-gray-300 text-light-text hover:bg-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Share2 size={18} />
                  <span>Compartir</span>
                </button>
              )}
              
              {/* Botón Copiar Texto - Solo visible en desktop */}
              <button
                onClick={handleCopyText}
                className="flex-1 hidden sm:flex bg-white/60 backdrop-blur-sm border-2 border-gray-300 text-light-text hover:bg-white font-semibold py-4 rounded-xl transition-all items-center justify-center space-x-2 text-base"
              >
                {copied ? (
                  <>
                    <Check size={20} className="text-green-600" />
                    <span className="text-green-600">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
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
                onClick={() => navigate('/dashboard')}
                className="bg-white/60 backdrop-blur-sm border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all text-sm sm:text-base"
              >
                Generar Otro Versículo
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultPage;
