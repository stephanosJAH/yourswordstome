import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVersesHistory } from '../hooks/useVersesHistory';
import { getFirstName } from '../utils/nameUtils';
import { hasUnlimitedAccess } from '../services/userService';
import {
  LogOut, Sparkles, Heart, BookOpen, Trash2, Clock,
  Search, User, ArrowLeft, X
} from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  const {
    verses,
    loading: versesLoading,
    toggleFavorite,
    removeVerse,
    favoritesOnly,
    setFavoritesOnly,
    totalCount,
  } = useVersesHistory(user?.uid);

  const isUnlimited = userData && hasUnlimitedAccess(userData.email);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Filtrar por búsqueda (referencia o texto del versículo)
  const filteredVerses = useMemo(() => {
    if (!searchQuery.trim()) return verses;
    const q = searchQuery.toLowerCase();
    return verses.filter(
      (v) =>
        v.verseReference?.toLowerCase().includes(q) ||
        v.personalizedText?.toLowerCase().includes(q) ||
        v.originalText?.toLowerCase().includes(q)
    );
  }, [verses, searchQuery]);

  const favoritesCount = useMemo(() => verses.filter((v) => v.isFavorite).length, [verses]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="background-gradient fixed inset-0 z-0" aria-hidden="true"></div>
      <div className="ethereal-blur fixed inset-0 z-0" aria-hidden="true"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="w-full px-4 sm:px-8 py-4 sm:py-6">
          <div className="container mx-auto flex justify-between items-center flex-wrap gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-sm text-light-subtle hover:text-accent transition-colors touch-target"
                aria-label="Volver al dashboard"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-light-text">
                Mis Versículos
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm font-medium text-light-subtle hidden sm:inline">
                Hola, {getFirstName(user?.displayName)}!
              </span>
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-blue-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full" aria-label={`Tokens disponibles: ${isUnlimited ? 'ilimitados' : userData?.tokens || 0}`}>
                <Sparkles className="text-accent" size={16} aria-hidden="true" />
                <span className="font-semibold text-accent text-xs sm:text-base">
                  {isUnlimited ? '∞' : userData?.tokens || 0}
                </span>
                <span className="text-xs sm:text-sm text-accent hidden sm:inline">tokens</span>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-accent transition-all duration-300 flex-shrink-0 touch-target"
                aria-label="Ver perfil"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <User size={16} className="text-accent" aria-hidden="true" />
                  </div>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/60 backdrop-blur-sm border border-gray-200/80 text-light-text hover:bg-white font-semibold py-2 px-3 sm:px-5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-sm hover:shadow-md touch-target"
                aria-label="Cerrar sesión"
              >
                <LogOut size={16} aria-hidden="true" />
                <span className="hidden sm:inline text-sm">Salir</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-4 pb-16 pt-4" id="main-content">

          {/* Título + stats */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <BookOpen size={28} className="text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-accent mb-1">
              Historial de Versículos
            </h2>
            <p className="text-sm text-gray-500">
              {totalCount} versículo{totalCount !== 1 ? 's' : ''} generado{totalCount !== 1 ? 's' : ''} ·{' '}
              {favoritesCount} favorito{favoritesCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Controles: búsqueda + filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Buscador */}
            <div className="relative flex-1">
              <label htmlFor="verse-search" className="visually-hidden">Buscar versículos</label>
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                id="verse-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por referencia o texto..."
                className="w-full pl-9 pr-9 py-2.5 glass-card text-sm text-light-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Toggle todos / favoritos */}
            <div className="flex surface-elevated p-1 gap-1 self-start sm:self-auto">
              <button
                onClick={() => setFavoritesOnly(false)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !favoritesOnly ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Clock size={14} />
                Todos
              </button>
              <button
                onClick={() => setFavoritesOnly(true)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  favoritesOnly ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart size={14} />
                Favoritos
                {favoritesCount > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                    favoritesOnly ? 'bg-white/30 text-white' : 'bg-blue-100 text-accent'
                  }`}>
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Loading */}
          {versesLoading && (
            <div className="text-center py-20" role="status" aria-label="Cargando versículos">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" aria-hidden="true"></div>
              <p className="mt-4 text-gray-500 text-sm">Cargando versículos...</p>
            </div>
          )}

          {/* Sin resultados de búsqueda */}
          {!versesLoading && verses.length > 0 && filteredVerses.length === 0 && (
            <div className="text-center py-16">
              <Search size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No se encontraron versículos</p>
              <p className="text-sm text-gray-400 mt-1">Intenta con otra búsqueda</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}

          {/* Empty state */}
          {!versesLoading && verses.length === 0 && (
            <div className="glass-card shadow-lg p-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                <BookOpen size={36} className="text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2">
                {favoritesOnly ? 'Aún no tienes versículos favoritos' : 'Aún no has generado versículos'}
              </h3>
              <p className="text-sm text-light-subtle mb-6 max-w-xs mx-auto">
                {favoritesOnly
                  ? 'Marca versículos como favoritos para verlos aquí'
                  : 'Genera tu primer versículo personalizado desde el dashboard'}
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-xl transition-all text-sm shadow-lg hover:shadow-primary/40 inline-flex items-center gap-2"
              >
                <Sparkles size={16} />
                Ir al Dashboard
              </button>
            </div>
          )}

          {/* Grid de versículos */}
          {!versesLoading && filteredVerses.length > 0 && (
            <>
              {searchQuery && (
                <p className="text-xs text-gray-500 mb-4">
                  {filteredVerses.length} resultado{filteredVerses.length !== 1 ? 's' : ''} para &ldquo;{searchQuery}&rdquo;
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredVerses.map((verse) => (
                  <div
                    key={verse.id}
                    onClick={() =>
                      navigate('/verse', {
                        state: {
                          verseData: {
                            reference: verse.verseReference,
                            originalText: verse.originalText,
                            personalizedText: verse.personalizedText,
                            translation: verse.translation,
                          },
                          verseId: verse.id,
                          isFavorite: verse.isFavorite,
                          styleConfig: verse.styleConfig || null,
                        },
                      })
                    }
                    className="glass-card glass-card-hover p-5 cursor-pointer group"
                    role="article"
                    aria-label={`Versículo ${verse.verseReference}`}  
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/verse', {
                          state: {
                            verseData: {
                              reference: verse.verseReference,
                              originalText: verse.originalText,
                              personalizedText: verse.personalizedText,
                              translation: verse.translation,
                            },
                            verseId: verse.id,
                            isFavorite: verse.isFavorite,
                            styleConfig: verse.styleConfig || null,
                          },
                        });
                      }
                    }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {verse.verseReference}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(verse.id, verse.isFavorite);
                          }}
                          className={`p-2 rounded-full transition-all touch-target ${
                            verse.isFavorite
                              ? 'text-red-500 bg-red-50 hover:bg-red-100'
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                          aria-label={verse.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          aria-pressed={verse.isFavorite}
                        >
                          <Heart size={16} fill={verse.isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('¿Estás seguro de eliminar este versículo?')) {
                              removeVerse(verse.id);
                            }
                          }}
                          className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all touch-target"
                          aria-label={`Eliminar versículo ${verse.verseReference}`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Texto */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-4">
                      {verse.personalizedText || verse.originalText}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
                      <span>
                        {verse.createdAt instanceof Date
                          ? verse.createdAt.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Fecha no disponible'}
                      </span>
                      <span className="text-primary font-medium group-hover:translate-x-1 transition-transform duration-300">
                        Ver más →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Footer minimalista */}
        <footer className="border-t border-gray-200 py-6 px-4 text-center">
          <p className="text-xs text-light-subtle">
            © {new Date().getFullYear()} YourWordsToMe. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HistoryPage;
