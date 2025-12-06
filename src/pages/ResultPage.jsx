import React, { useState, useRef, useEffect, useMemo } from 'react';
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

// Definición de paletas de colores por estilo
const styleThemes = {
  classic: {
    id: 'classic',
    name: 'Clásico',
    // Amarillos/Dorados - estilo clásico elegante
    gradientFrom: 'from-amber-50',
    gradientVia: 'via-yellow-100',
    gradientTo: 'to-amber-200',
    bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
    primary: '#d97706', // amber-600
    primaryLight: '#fbbf24', // amber-400
    primaryDark: '#b45309', // amber-700
    accent: '#92400e', // amber-800
    textPrimary: '#78350f', // amber-900
    textSecondary: '#a16207', // yellow-700
    cardBg: 'rgba(255, 251, 235, 0.7)', // amber-50 con transparencia
    cardBorder: 'rgba(217, 119, 6, 0.3)', // amber-600 con transparencia
    buttonBg: '#d97706',
    buttonHover: '#b45309',
  },
  modern: {
    id: 'modern',
    name: 'Moderno',
    // Marrones/Tierra - estilo moderno con imagen de montaña
    gradientFrom: 'from-stone-100',
    gradientVia: 'via-amber-100',
    gradientTo: 'to-stone-200',
    bgGradient: 'linear-gradient(135deg, #f5f5f4 0%, #d6d3d1 50%, #a8a29e 100%)',
    primary: '#78716c', // stone-500
    primaryLight: '#a8a29e', // stone-400
    primaryDark: '#57534e', // stone-600
    accent: '#44403c', // stone-700
    textPrimary: '#1c1917', // stone-900
    textSecondary: '#57534e', // stone-600
    cardBg: 'rgba(245, 245, 244, 0.7)', // stone-100 con transparencia
    cardBorder: 'rgba(120, 113, 108, 0.3)', // stone-500 con transparencia
    buttonBg: '#57534e',
    buttonHover: '#44403c',
  },
  inspirational: {
    id: 'inspirational',
    name: 'Inspiracional',
    // Azules/Púrpuras/Rosas - estilo vibrante
    gradientFrom: 'from-blue-100',
    gradientVia: 'via-purple-100',
    gradientTo: 'to-pink-100',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #e9d5ff 50%, #fce7f3 100%)',
    primary: '#8b5cf6', // violet-500
    primaryLight: '#a78bfa', // violet-400
    primaryDark: '#7c3aed', // violet-600
    accent: '#6d28d9', // violet-700
    textPrimary: '#4c1d95', // violet-900
    textSecondary: '#7c3aed', // violet-600
    cardBg: 'rgba(237, 233, 254, 0.7)', // violet-100 con transparencia
    cardBorder: 'rgba(139, 92, 246, 0.3)', // violet-500 con transparencia
    buttonBg: '#8b5cf6',
    buttonHover: '#7c3aed',
  }
};

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  const canvasRef = useRef(null);

  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [previousStyle, setPreviousStyle] = useState('classic');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  // Usar datos del state o datos de prueba para desarrollo
  const verseData = location.state?.verseData || DUMP_VERSE_DATA;
  const verseId = location.state?.verseId || null;
  
  // Verificar si el usuario tiene acceso ilimitado
  const isUnlimited = userData && hasUnlimitedAccess(userData.email);

  // Obtener tema actual y anterior
  const currentTheme = styleThemes[selectedStyle];
  const prevTheme = styleThemes[previousStyle];

  // Manejar cambio de estilo con animación
  const handleStyleChange = (newStyleId) => {
    if (newStyleId === selectedStyle || isTransitioning) return;
    
    setPreviousStyle(selectedStyle);
    setIsTransitioning(true);
    setSelectedStyle(newStyleId);
    
    // Duración de la animación
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

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

  // CSS para la animación sunrise (curva desde esquina inferior derecha)
  const sunriseAnimation = `
    @keyframes sunriseReveal {
      0% {
        clip-path: ellipse(0% 0% at 100% 100%);
      }
      100% {
        clip-path: ellipse(200% 200% at 100% 100%);
      }
    }
  `;

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
      {/* Inyectar CSS de animación */}
      <style>{sunriseAnimation}</style>
      
      {/* Capa de fondo anterior (visible durante la transición) */}
      <div 
        className="fixed inset-0 z-0 transition-opacity duration-300"
        style={{ 
          background: prevTheme.bgGradient,
          opacity: isTransitioning ? 1 : 0,
          pointerEvents: 'none'
        }}
      />
      
      {/* Capa de fondo actual con animación sunrise */}
      <div 
        className="fixed inset-0 z-0"
        style={{ 
          background: currentTheme.bgGradient,
          animation: isTransitioning ? 'sunriseReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          clipPath: isTransitioning ? 'ellipse(0% 0% at 100% 100%)' : 'ellipse(200% 200% at 100% 100%)'
        }}
      />
      
      {/* Efecto de brillo tipo "sol naciente" durante la transición */}
      {isTransitioning && (
        <div 
          className="fixed z-0 pointer-events-none"
          style={{
            bottom: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            background: `radial-gradient(ellipse at center, ${currentTheme.primaryLight}40 0%, transparent 70%)`,
            animation: 'sunriseReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            filter: 'blur(40px)',
          }}
        />
      )}
      
      {/* Partículas decorativas que se mueven con el tema */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, ${currentTheme.primaryLight} 0%, transparent 70%)`,
            top: '-10%',
            left: '-10%',
            transform: isTransitioning ? 'scale(0.5)' : 'scale(1)',
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full opacity-15 transition-all duration-1000 ease-out delay-100"
          style={{
            background: `radial-gradient(circle, ${currentTheme.primary} 0%, transparent 70%)`,
            bottom: '10%',
            right: '-5%',
            transform: isTransitioning ? 'scale(0.5)' : 'scale(1)',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full px-4 sm:px-8 py-4 sm:py-6">
          <div className="container mx-auto flex justify-between items-center flex-wrap gap-3 sm:gap-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 transition-colors mr-4"
                style={{ color: currentTheme.textPrimary }}
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Volver</span>
              </button>
              <h1 
                className="text-lg sm:text-xl font-bold tracking-tight transition-colors duration-500"
                style={{ color: currentTheme.textPrimary }}
              >
                YourWordsToMe
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span 
                className="text-xs sm:text-sm font-medium hidden sm:inline transition-colors duration-500"
                style={{ color: currentTheme.textSecondary }}
              >
                Hola, {getFirstName(user?.displayName)}!
              </span>
              <div 
                className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: `${currentTheme.primary}20`,
                }}
              >
                <Sparkles style={{ color: currentTheme.primary }} size={16} />
                <span 
                  className="font-semibold text-xs sm:text-base transition-colors duration-500"
                  style={{ color: currentTheme.primary }}
                >
                  {isUnlimited ? '∞' : (userData?.tokens || 0)}
                </span>
                <span 
                  className="text-xs sm:text-sm hidden sm:inline transition-colors duration-500"
                  style={{ color: currentTheme.primary }}
                >
                  tokens
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="backdrop-blur-sm font-semibold py-2 px-3 sm:px-5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                  borderWidth: '1px',
                  color: currentTheme.textPrimary
                }}
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
              <h2 
                className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center transition-colors duration-500"
                style={{ color: currentTheme.primary }}
              >
                Selecciona un Estilo
              </h2>
              <div className="flex justify-center flex-wrap gap-2.5 sm:gap-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleStyleChange(style.id)}
                    disabled={isTransitioning}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base disabled:cursor-not-allowed ${
                      selectedStyle === style.id
                        ? 'text-white shadow-lg scale-105'
                        : 'backdrop-blur-sm hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: selectedStyle === style.id 
                        ? currentTheme.buttonBg 
                        : currentTheme.cardBg,
                      color: selectedStyle === style.id 
                        ? 'white' 
                        : currentTheme.textPrimary,
                      borderWidth: selectedStyle === style.id ? '0' : '1px',
                      borderColor: currentTheme.cardBorder,
                    }}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div 
              className="backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-500"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderWidth: '1px',
                borderColor: currentTheme.cardBorder,
              }}
            >
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
                      : 'backdrop-blur-sm border-2 border-red-300 text-red-500 hover:bg-red-50'
                  }`}
                  style={{
                    backgroundColor: isFavorite ? undefined : currentTheme.cardBg,
                  }}
                  title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  <span className="sm:hidden">{isFavorite ? 'Favorito' : 'Agregar'}</span>
                </button>
              )}
              
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
                style={{
                  backgroundColor: currentTheme.buttonBg,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonBg}
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
                  className="flex-1 sm:hidden backdrop-blur-sm border-2 font-semibold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm"
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.cardBorder,
                    color: currentTheme.textPrimary,
                  }}
                >
                  <Share2 size={18} />
                  <span>Compartir</span>
                </button>
              )}
              
              {/* Botón Copiar Texto - Solo visible en desktop */}
              <button
                onClick={handleCopyText}
                className="flex-1 hidden sm:flex backdrop-blur-sm border-2 font-semibold py-4 rounded-xl transition-all items-center justify-center space-x-2 text-base"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                  color: currentTheme.textPrimary,
                }}
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
            <div 
              className="p-4 sm:p-6 backdrop-blur-sm rounded-xl transition-all duration-500"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderWidth: '1px',
                borderColor: currentTheme.cardBorder,
              }}
            >
              <h3 
                className="text-xs sm:text-sm font-semibold mb-2 transition-colors duration-500"
                style={{ color: currentTheme.textPrimary }}
              >
                Texto Original:
              </h3>
              <p 
                className="text-sm sm:text-base italic mb-2 transition-colors duration-500"
                style={{ color: currentTheme.textSecondary }}
              >
                "{verseData.originalText}"
              </p>
              <p 
                className="text-xs sm:text-sm transition-colors duration-500"
                style={{ color: currentTheme.textSecondary }}
              >
                — {verseData.reference} ({verseData.translation})
              </p>
            </div>

            {/* Botón para generar otro */}
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="backdrop-blur-sm border-2 font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all text-sm sm:text-base hover:text-white"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: currentTheme.primary,
                  color: currentTheme.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.buttonBg;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = currentTheme.primary;
                }}
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
