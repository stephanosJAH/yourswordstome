import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasUnlimitedAccess } from '../services/userService';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import ClassicStyle from '../components/visual/ClassicStyle';
import ModernStyle from '../components/visual/ModernStyle';
import InspirationalStyle from '../components/visual/InspirationalStyle';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const canvasRef = useRef(null);

  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [downloading, setDownloading] = useState(false);

  const verseData = location.state?.verseData;
  
  // Verificar si el usuario tiene acceso ilimitado
  const isUnlimited = userData && hasUnlimitedAccess(userData.email);

  // Obtener solo el primer nombre del usuario
  const getFirstName = (fullName) => {
    if (!fullName) return 'amigo';
    return fullName.split(' ')[0];
  };

  // Si no hay datos, redirigir al dashboard
  React.useEffect(() => {
    if (!verseData) {
      navigate('/dashboard');
    }
  }, [verseData, navigate]);

  if (!verseData) return null;

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
    } else {
      // Fallback: copiar al portapapeles
      alert('Compartir no disponible. Descarga la imagen para compartirla.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
            <div className="flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full">
              <span className="font-semibold text-accent">
                {isUnlimited ? '∞' : (userData?.tokens || 0)} tokens restantes
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Style Selector */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Selecciona un Estilo
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedStyle === style.id
                      ? 'bg-accent text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex justify-center">
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
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                onClick={handleShare}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <Share2 size={20} />
                <span>Compartir</span>
              </button>
            )}
          </div>

          {/* Original Text Reference */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Texto Original:
            </h3>
            <p className="text-gray-600 italic">
              "{verseData.originalText}"
            </p>
            <p className="text-sm text-gray-500 mt-2">
              — {verseData.reference} ({verseData.translation})
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
