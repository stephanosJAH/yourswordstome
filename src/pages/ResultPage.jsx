import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasUnlimitedAccess } from '../services/userService';
import { toggleFavorite, saveStyleConfig } from '../services/verseHistoryService';
import html2canvas from 'html2canvas';
import {
  ArrowLeft, Download, Share2, Sparkles, LogOut, Copy, Check,
  Heart, Image, Type, AlignCenter, AlignLeft, AlignRight,
  Crop, Palette, SlidersHorizontal, Save, User,
} from 'lucide-react';
import ModernImageModal from '../components/ModernImageModal';
import { getFirstName } from '../utils/nameUtils';

const modernImageModules = import.meta.glob('../assets/modern/*.jpg', { eager: true });
const modernImageEntries = Object.entries(modernImageModules).map(([path, m]) => ({
  src: m.default,
  name: path.split('/').pop(),
}));
const modernImages = modernImageEntries.map(e => e.src);

const getImageName = (src) => modernImageEntries.find(e => e.src === src)?.name || null;
const getImageBySrc = (name) => modernImageEntries.find(e => e.name === name)?.src || null;

const DUMP_VERSE_DATA = {
  personalizedText: "Esteban, recuerda que te mandé que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo dondequiera que vayas.",
  originalText: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo dondequiera que vayas.",
  reference: "Josué 1:9",
  translation: "RVR1960",
};

const FONTS = [
  { id: 'Montserrat',        name: 'Montserrat',      family: 'Montserrat, sans-serif' },
  { id: 'Cormorant Garamond', name: 'Cormorant',       family: '"Cormorant Garamond", serif' },
  { id: 'Playfair Display',  name: 'Playfair',         family: '"Playfair Display", serif' },
  { id: 'Dancing Script',    name: 'Dancing Script',   family: '"Dancing Script", cursive' },
  { id: 'Lato',              name: 'Lato',             family: 'Lato, sans-serif' },
  { id: 'Inter',             name: 'Inter',            family: 'Inter, sans-serif' },
];

const FONT_FAMILY_MAP = Object.fromEntries(FONTS.map(f => [f.id, f.family]));

const PRESET_COLORS = ['#ffffff', '#f5f5dc', '#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#000000', '#1a1a1a'];

const BG_PRESET_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#2d132c', '#1b1b2f', '#162447', '#1f4068',
  '#e2d1c3', '#fef9ef', '#d4a373', '#264653',
];

const ResultPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, userData, logout } = useAuth();
  const canvasRef = useRef(null);

  const verseData   = location.state?.verseData || DUMP_VERSE_DATA;
  const verseId     = location.state?.verseId   || null;
  const savedStyle  = location.state?.styleConfig || null;
  const isUnlimited = userData && hasUnlimitedAccess(userData.email);

  // ── Image / Background ─────────────────────────────────────────────────────
  const [selectedImage,    setSelectedImage]    = useState(null);
  const [quickImages,      setQuickImages]      = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [bgMode,           setBgMode]           = useState(savedStyle?.bgMode || 'image'); // 'image' | 'color'
  const [bgColor,          setBgColor]          = useState(savedStyle?.bgColor || '#1a1a2e');

  useEffect(() => {
    const shuffled = [...modernImages].sort(() => Math.random() - 0.5);
    setQuickImages(shuffled.slice(0, 3));

    // Restaurar imagen guardada o usar la primera aleatoria
    const restoredImage = savedStyle?.selectedImageName
      ? getImageBySrc(savedStyle.selectedImageName)
      : null;
    setSelectedImage(restoredImage || shuffled[0]);
  }, []);

  // ── Editor state ───────────────────────────────────────────────────────────
  const [selectedElement, setSelectedElement] = useState('verse'); // 'verse' | 'citation'
  const [activeTab,       setActiveTab]       = useState(null);
  const [isExporting,     setIsExporting]     = useState(false);

  // Per-element typography (restaurar desde savedStyle si existe)
  const [verseFont,     setVerseFont]     = useState(savedStyle?.verseFont     || 'Montserrat');
  const [citationFont,  setCitationFont]  = useState(savedStyle?.citationFont  || 'Montserrat');
  const [verseAlign,    setVerseAlign]    = useState(savedStyle?.verseAlign    || 'center');
  const [citationAlign, setCitationAlign] = useState(savedStyle?.citationAlign || 'center');
  const [verseFontSize,    setVerseFontSize]    = useState(savedStyle?.verseFontSize    ?? 22);
  const [citationFontSize, setCitationFontSize] = useState(savedStyle?.citationFontSize ?? 15);
  const [verseLineHeight,    setVerseLineHeight]    = useState(savedStyle?.verseLineHeight    ?? 1.5);
  const [citationLineHeight, setCitationLineHeight] = useState(savedStyle?.citationLineHeight ?? 1.5);
  const [verseColor,    setVerseColor]    = useState(savedStyle?.verseColor    || '#ffffff');
  const [citationColor, setCitationColor] = useState(savedStyle?.citationColor || '#f0f0f0');

  // Resolution & image adjustments
  const [resolution,     setResolution]     = useState(savedStyle?.resolution     || '1:1');
  const [overlayOpacity, setOverlayOpacity] = useState(savedStyle?.overlayOpacity ?? 45);
  const [imageBlur,      setImageBlur]      = useState(savedStyle?.imageBlur      ?? 0);

  // Action state
  const [isFavorite,       setIsFavorite]       = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const [downloading,      setDownloading]      = useState(false);
  const [copied,           setCopied]           = useState(false);
  const [saving,           setSaving]           = useState(false);
  const [saved,            setSaved]            = useState(false);

  useEffect(() => {
    if (location.state?.isFavorite !== undefined) setIsFavorite(location.state.isFavorite);
  }, [location.state?.isFavorite]);

  // ── Active-element helpers ─────────────────────────────────────────────────
  const isVerse = selectedElement === 'verse';
  const activeFont       = isVerse ? verseFont       : citationFont;
  const setActiveFont    = isVerse ? setVerseFont    : setCitationFont;
  const activeAlign      = isVerse ? verseAlign      : citationAlign;
  const setActiveAlign   = isVerse ? setVerseAlign   : setCitationAlign;
  const activeFontSize   = isVerse ? verseFontSize   : citationFontSize;
  const setActiveFontSize= isVerse ? setVerseFontSize: setCitationFontSize;
  const activeLineHeight    = isVerse ? verseLineHeight    : citationLineHeight;
  const setActiveLineHeight = isVerse ? setVerseLineHeight : setCitationLineHeight;
  const activeColor      = isVerse ? verseColor      : citationColor;
  const setActiveColor   = isVerse ? setVerseColor   : setCitationColor;

  // ── Preview dimensions ─────────────────────────────────────────────────────
  const previewAspect = resolution === '3:4' ? '3/4' : '1/1';
  const previewMaxW   = resolution === '3:4' ? 405   : 540;

  // ── Style config helpers ───────────────────────────────────────────────────
  const buildStyleConfig = () => ({
    verseFont, citationFont,
    verseAlign, citationAlign,
    verseFontSize, citationFontSize,
    verseLineHeight, citationLineHeight,
    verseColor, citationColor,
    resolution, overlayOpacity, imageBlur,
    bgMode, bgColor,
    selectedImageName: getImageName(selectedImage),
  });

  const handleSaveStyle = async () => {
    if (!user?.uid || !verseId) return;
    setSaving(true);
    setSaved(false);
    try {
      await saveStyleConfig(user.uid, verseId, buildStyleConfig());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Error guardando estilo:', e);
    } finally {
      setSaving(false);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleToggleFavorite = async () => {
    if (!user?.uid || !verseId) return;
    setTogglingFavorite(true);
    try {
      await toggleFavorite(user.uid, verseId, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error('Error al marcar favorito:', e);
    } finally {
      setTogglingFavorite(false);
    }
  };

  const handleLogout = async () => {
    try { await logout(); navigate('/'); }
    catch (e) { console.error('Error al cerrar sesión:', e); }
  };

  const captureCanvas = async () => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 60));
    try {
      return await html2canvas(canvasRef.current, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: null,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    handleSaveStyle();
    try {
      const canvas = await captureCanvas();
      canvas.toBlob(blob => {
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `versiculo-${verseData.reference.replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setDownloading(false);
      });
    } catch (e) {
      console.error('Error al descargar:', e);
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    handleSaveStyle();
    try {
      const canvas = await captureCanvas();
      canvas.toBlob(async blob => {
        const file = new File([blob], 'versiculo.png', { type: 'image/png' });
        await navigator.share({ files: [file], title: verseData.reference, text: verseData.personalizedText });
      });
    } catch (e) { console.error('Error al compartir:', e); }
  };

  const handleCopyText = async () => {
    const text = `"${verseData.personalizedText}"\n\n— ${verseData.reference}\n\n✨ ${window.location.origin}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { console.error('Error al copiar:', e); }
  };

  const handleTabClick = (id) => setActiveTab(prev => prev === id ? null : id);

  // ── Tab definitions ────────────────────────────────────────────────────────
  const tabs = [
    { id: 'font',       icon: <Type size={17} />,           label: 'Tipografía' },
    { id: 'text',       icon: <span className="font-bold text-sm leading-none">aA</span>, label: 'Formato' },
    { id: 'resolution', icon: <Crop size={17} />,           label: 'Resolución' },
    { id: 'color',      icon: <Palette size={17} />,        label: 'Color' },
    { id: 'config',     icon: <SlidersHorizontal size={17} />, label: 'Config' },
  ];

  // ── Tab panels ─────────────────────────────────────────────────────────────
  const renderTabPanel = () => {
    const elementLabel = isVerse ? 'Versículo' : 'Cita';

    switch (activeTab) {
      case 'font':
        return (
          <div className="p-4">
            <p className="text-xs text-light-subtle mb-3">
              Editando: <span className="text-white font-medium">{elementLabel}</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FONTS.map(font => (
                <button
                  key={font.id}
                  onClick={() => setActiveFont(font.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    activeFont === font.id
                      ? 'border-accent bg-blue-50'
                      : 'border-gray-200 bg-white/60 hover:bg-white'
                  }`}
                >
                  <p className="text-[10px] text-light-subtle mb-1">{font.name}</p>
                  <p
                    className="text-sm text-light-text leading-snug overflow-hidden"
                    style={{ fontFamily: font.family, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  >
                    {isVerse ? verseData.personalizedText.slice(0, 36) + '…' : verseData.reference}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="p-4 space-y-4">
            <p className="text-xs text-light-subtle">
              Editando: <span className="text-white font-medium">{elementLabel}</span>
            </p>
            <div>
              <p className="text-xs text-light-subtle mb-2">Alineación</p>
              <div className="flex gap-2">
                {[
                  { id: 'left',   icon: <AlignLeft   size={15} /> },
                  { id: 'center', icon: <AlignCenter size={15} /> },
                  { id: 'right',  icon: <AlignRight  size={15} /> },
                ].map(({ id, icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveAlign(id)}
                    className={`flex-1 flex items-center justify-center py-2 rounded-lg border transition-all ${
                      activeAlign === id
                        ? 'border-accent bg-blue-50 text-white'
                        : 'border-gray-200 bg-white/60 text-light-subtle hover:bg-white'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-light-subtle mb-2">
                Tamaño: <span className="text-white">{activeFontSize}px</span>
              </p>
              <input type="range" min="10" max="52" value={activeFontSize}
                onChange={e => setActiveFontSize(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <p className="text-xs text-light-subtle mb-2">
                Interlineado: <span className="text-white">{activeLineHeight.toFixed(1)}</span>
              </p>
              <input type="range" min="1" max="2.5" step="0.1" value={activeLineHeight}
                onChange={e => setActiveLineHeight(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        );

      case 'resolution':
        return (
          <div className="p-4">
            <p className="text-xs text-light-subtle mb-3">Formato de imagen</p>
            <div className="flex gap-3">
              {[
                { id: '1:1', label: '1:1', desc: 'Cuadrado',  dims: '1080 × 1080', w: 32, h: 32 },
                { id: '3:4', label: '3:4', desc: 'Vertical',  dims: '1080 × 1440', w: 24, h: 32 },
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setResolution(r.id)}
                  className={`flex-1 p-4 rounded-xl border transition-all ${
                    resolution === r.id
                      ? 'border-accent bg-blue-50'
                      : 'border-gray-200 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <div
                      className="border-2 rounded"
                      style={{
                        width:  r.w,
                        height: r.h,
                        borderColor: resolution === r.id ? '#3B82F6' : '#9ca3af',
                      }}
                    />
                  </div>
                  <p className={`text-sm font-bold ${resolution === r.id ? 'text-accent' : 'text-light-text'}`}>{r.label}</p>
                  <p className="text-xs text-light-subtle">{r.desc}</p>
                  <p className="text-xs text-gray-400">{r.dims}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 'color':
        return (
          <div className="p-4 space-y-3">
            <p className="text-xs text-light-subtle">
              Editando: <span className="text-white font-medium">{elementLabel}</span>
            </p>
            <p className="text-xs text-light-subtle">Color de texto</p>
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="color"
                value={activeColor.startsWith('rgba') ? '#ffffff' : activeColor}
                onChange={e => setActiveColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0.5"
              />
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      activeColor === c ? 'scale-110 border-accent' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'config':
        return (
          <div className="p-4 space-y-4">
            <p className="text-xs text-light-subtle mb-1">Ajustes de imagen</p>
            <div>
              <p className="text-xs text-light-subtle mb-2">
                Oscuridad: <span className="text-white">{overlayOpacity}%</span>
              </p>
              <input type="range" min="0" max="90" value={overlayOpacity}
                onChange={e => setOverlayOpacity(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <p className="text-xs text-light-subtle mb-2">
                Difuminado: <span className="text-white">{imageBlur}px</span>
              </p>
              <input type="range" min="0" max="15" value={imageBlur}
                onChange={e => setImageBlur(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background — mismo que Dashboard */}
      <div className="background-gradient fixed inset-0 z-0"></div>
      <div className="ethereal-blur fixed inset-0 z-0"></div>

      {/* Content */}
      <div className="relative z-10">

      {/* Header */}
      <header className="w-full px-4 sm:px-8 py-4 sm:py-6">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-sm text-light-subtle hover:text-accent transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-light-text">YourWordsToMe</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm font-medium text-light-subtle hidden sm:inline">
              Hola, {getFirstName(user?.displayName)}!
            </span>
            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-blue-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <Sparkles className="text-accent" size={16} />
              <span className="font-semibold text-accent text-xs sm:text-base">
                {isUnlimited ? '∞' : (userData?.tokens || 0)}
              </span>
              <span className="text-xs sm:text-sm text-accent hidden sm:inline">tokens</span>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-accent transition-all duration-300 flex-shrink-0"
              title="Ver perfil"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <User size={16} className="text-accent" />
                </div>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/60 backdrop-blur-sm border border-gray-200/80 text-light-text hover:bg-white font-semibold py-2 px-3 sm:px-5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline text-sm">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        <div className="max-w-xl mx-auto">

          {/* ── Background selector ── */}
          <div className="mb-4 space-y-2">
            {/* Mode toggle */}
            <div className="flex gap-1 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-1 w-fit">
              <button
                onClick={() => setBgMode('image')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  bgMode === 'image'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-light-subtle hover:text-light-text'
                }`}
              >
                <Image size={14} />
                Imagen
              </button>
              <button
                onClick={() => setBgMode('color')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  bgMode === 'color'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-light-subtle hover:text-light-text'
                }`}
              >
                <Palette size={14} />
                Color
              </button>
            </div>

            {bgMode === 'image' ? (
              /* Image selector */
              <div className="flex items-center gap-2">
                <div className="flex gap-2 flex-1 min-w-0">
                  {quickImages.map((img, i) => {
                    const isSelected = selectedImage === img;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className="relative flex-1 aspect-square rounded-xl overflow-hidden focus:outline-none transition-all duration-200"
                        style={{ boxShadow: isSelected ? '0 0 0 3px #3B82F6' : '0 0 0 2px transparent' }}
                      >
                        <img src={img} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-accent/30">
                            <div className="rounded-full p-1 bg-accent">
                              <Check size={12} className="text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="flex-none flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/60 backdrop-blur-sm hover:bg-white border border-gray-200 text-light-text transition-all whitespace-nowrap shadow-sm"
                >
                  <Image size={16} />
                  <span className="hidden sm:inline">Ver todas</span>
                </button>
              </div>
            ) : (
              /* Color selector */
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0.5 flex-none"
                />
                <div className="flex flex-wrap gap-2">
                  {BG_PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setBgColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        bgColor === c ? 'scale-110 border-accent' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Preview ── */}
          <div className="flex justify-center mb-3">
            <div className="relative w-full" style={{ maxWidth: previewMaxW }}>
            <div
              ref={canvasRef}
              className="relative overflow-hidden rounded-2xl w-full shadow-xl"
              style={{
                aspectRatio: previewAspect,
              }}
            >
              {/* Background image or solid color */}
              {bgMode === 'image' && selectedImage ? (
                <img
                  src={selectedImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    filter:    imageBlur > 0 ? `blur(${imageBlur}px)` : 'none',
                    transform: imageBlur > 0 ? 'scale(1.08)' : 'scale(1)',
                    transition: 'filter 0.2s, transform 0.2s',
                  }}
                />
              ) : bgMode === 'color' ? (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: bgColor }}
                />
              ) : null}
              {/* Darkness overlay (only for image mode) */}
              {bgMode === 'image' && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
                />
              )}
              {/* Text content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 gap-4">
                {/* Verse */}
                <p
                  onClick={() => setSelectedElement('verse')}
                  className="w-full cursor-pointer"
                  style={{
                    fontFamily:  FONT_FAMILY_MAP[verseFont] || 'Montserrat, sans-serif',
                    fontSize:    `${verseFontSize}px`,
                    lineHeight:  verseLineHeight,
                    color:       verseColor,
                    textAlign:   verseAlign,
                    outline:     !isExporting && selectedElement === 'verse'
                      ? '2px solid rgba(59,130,246,0.8)' : 'none',
                    borderRadius: '6px',
                    padding:     '4px 6px',
                  }}
                >
                  {verseData.personalizedText}
                </p>
                {/* Separator */}
                <div className="h-px w-12 flex-none" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }} />
                {/* Citation */}
                <p
                  onClick={() => setSelectedElement('citation')}
                  className="cursor-pointer"
                  style={{
                    fontFamily:  FONT_FAMILY_MAP[citationFont] || 'Montserrat, sans-serif',
                    fontSize:    `${citationFontSize}px`,
                    lineHeight:  citationLineHeight,
                    color:       citationColor,
                    textAlign:   citationAlign,
                    outline:     !isExporting && selectedElement === 'citation'
                      ? '2px solid rgba(59,130,246,0.8)' : 'none',
                    borderRadius: '6px',
                    padding:     '4px 6px',
                  }}
                >
                  {verseData.reference}
                </p>
              </div>
            </div>
            {/* Action buttons overlay */}
            {!isExporting && (
              <div className="absolute bottom-3 right-3 flex gap-2 z-10">
                {verseId && (
                  <button onClick={handleToggleFavorite} disabled={togglingFavorite}
                    className={`p-2.5 rounded-full backdrop-blur-sm transition-all disabled:opacity-50 ${
                      isFavorite ? 'bg-red-500 text-white shadow-lg' : 'bg-white/70 text-red-500 hover:bg-white'
                    }`}>
                    <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                )}
                {verseId && (
                  <button onClick={handleSaveStyle} disabled={saving}
                    className={`p-2.5 rounded-full backdrop-blur-sm transition-all disabled:opacity-50 ${
                      saved ? 'bg-green-500 text-white shadow-lg' : 'bg-white/70 text-accent hover:bg-white'
                    }`}>
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent" />
                    ) : saved ? (
                      <Check size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                  </button>
                )}
                <button onClick={handleDownload} disabled={downloading}
                  className="p-2.5 rounded-full bg-white/70 backdrop-blur-sm text-primary hover:bg-white transition-all disabled:opacity-50">
                  {downloading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  ) : (
                    <Download size={18} />
                  )}
                </button>
                {navigator.share && (
                  <button onClick={handleShare}
                    className="p-2.5 rounded-full bg-white/70 backdrop-blur-sm text-light-text hover:bg-white transition-all sm:hidden">
                    <Share2 size={18} />
                  </button>
                )}
                <button onClick={handleCopyText}
                  className="p-2.5 rounded-full bg-white/70 backdrop-blur-sm text-light-text hover:bg-white transition-all hidden sm:flex">
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
              </div>
            )}
            </div>
          </div>

          {/* Element selector pills */}
          <div className="flex justify-center gap-3 mb-3">
            {[
              { id: 'verse',    label: 'Versículo' },
              { id: 'citation', label: 'Cita' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSelectedElement(id)}
                className={`text-xs px-4 py-1.5 rounded-full transition-all font-medium ${
                  selectedElement === id
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-white/60 backdrop-blur-sm border border-gray-200 text-light-subtle hover:bg-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── 5 Tab buttons ── */}
          <div className="flex gap-1 mb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 border-accent text-accent'
                    : 'bg-white/60 backdrop-blur-sm border-gray-200 text-light-subtle hover:bg-white hover:text-light-text'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── Tab panel ── */}
          {activeTab && (
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl mb-4 min-h-[160px] shadow-sm">
              {renderTabPanel()}
            </div>
          )}

          {/* ── Original text ── */}
          <div className="p-4 sm:p-5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl mb-4">
            <h3 className="text-xs font-semibold text-light-subtle mb-2">Texto Original</h3>
            <p className="text-sm italic text-light-subtle mb-2">"{verseData.originalText}"</p>
            <p className="text-xs text-gray-400">— {verseData.reference} ({verseData.translation})</p>
          </div>

          {/* ── Generate another ── */}
          <div className="text-center pb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white/60 backdrop-blur-sm hover:bg-white border-2 border-gray-300 text-accent hover:border-accent font-semibold py-2.5 px-8 rounded-xl transition-all text-sm"
            >
              Generar otro versículo
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 py-6 px-4 mt-4">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm font-semibold text-primary">YourWordsToMe</p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} YourWordsToMe. Todos los derechos reservados.</p>
          <p className="text-xs text-gray-400">Hecho con ❤️ para compartir la Palabra de Dios</p>
        </div>
      </footer>

      </div>{/* /Content */}

      {/* Image modal */}
      <ModernImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={modernImages}
        selectedImage={selectedImage}
        onSelect={setSelectedImage}
      />
    </div>
  );
};

export default ResultPage;
