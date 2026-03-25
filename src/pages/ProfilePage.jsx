import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasUnlimitedAccess } from '../services/userService';
import { useVersesHistory } from '../hooks/useVersesHistory';
import { getFirstName } from '../utils/nameUtils';
import {
  ArrowLeft,
  LogOut,
  Sparkles,
  BookOpen,
  Heart,
  Calendar,
  Clock,
  User,
  Mail,
  Infinity,
} from 'lucide-react';

const INITIAL_TOKENS = 5;

const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div className="bg-white/85 backdrop-blur-md rounded-xl border border-gray-200 p-5 flex flex-col gap-2 shadow-sm">
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-1 ${accent ?? 'bg-blue-100'}`}>
      <Icon size={20} className="text-accent" />
    </div>
    <p className="text-2xl font-bold text-light-text">{value}</p>
    <p className="text-sm font-medium text-light-text">{label}</p>
    {sub && <p className="text-xs text-light-subtle">{sub}</p>}
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  const { verses, loading: versesLoading } = useVersesHistory(user?.uid);

  const isUnlimited = userData && hasUnlimitedAccess(userData.email);
  const tokensAvailable = isUnlimited ? '∞' : (userData?.tokens ?? 0);
  const tokensUsed = userData?.totalGenerated ?? 0;
  const favoritesCount = verses.filter(v => v.isFavorite).length;

  const formatDate = (value) => {
    if (!value) return '—';
    const date = value?.toDate ? value.toDate() : new Date(value);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const tokenBarPercent = isUnlimited
    ? 100
    : Math.max(0, Math.round(((userData?.tokens ?? 0) / INITIAL_TOKENS) * 100));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="background-gradient fixed inset-0 z-0" />
      <div className="ethereal-blur fixed inset-0 z-0" />

      <div className="relative z-10">
        {/* Header */}
        <header className="w-full px-4 sm:px-8 py-4 sm:py-6">
          <div className="container mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-light-text hover:text-accent transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-light-text">YourWordsToMe</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-light-subtle hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6 animate-fade-in-up">

          {/* Avatar + Identity */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-blue-100 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User size={36} className="text-accent" />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-light-text mb-1">
                {user?.displayName || 'Usuario'}
              </h2>
              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-light-subtle mb-3">
                <Mail size={14} />
                {user?.email}
              </p>
              {isUnlimited && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full mb-3">
                  <Sparkles size={12} />
                  Acceso ilimitado
                </span>
              )}
              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-light-subtle">
                <Calendar size={13} />
                Miembro desde {formatDate(userData?.createdAt)}
              </p>
            </div>
          </div>

          {/* Token card */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-gray-200 p-6 shadow-md">
            <h3 className="text-base font-semibold text-light-text mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              Tokens
            </h3>

            <div className="flex items-end gap-6 mb-5">
              <div>
                <p className="text-4xl font-bold text-accent">
                  {isUnlimited ? <Infinity size={40} className="text-accent inline" /> : tokensAvailable}
                </p>
                <p className="text-sm text-light-subtle mt-1">Disponibles</p>
              </div>
              <div className="text-gray-300 text-2xl font-light mb-1">/</div>
              <div>
                <p className="text-2xl font-semibold text-light-text">{isUnlimited ? '∞' : INITIAL_TOKENS}</p>
                <p className="text-sm text-light-subtle mt-1">Iniciales</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-semibold text-gray-500">{tokensUsed}</p>
                <p className="text-sm text-light-subtle mt-1">Usados</p>
              </div>
            </div>

            {/* Progress bar */}
            {!isUnlimited && (
              <div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${tokenBarPercent}%` }}
                  />
                </div>
                <p className="text-xs text-light-subtle mt-2 text-right">{tokenBarPercent}% restante</p>
              </div>
            )}

            {!isUnlimited && (userData?.tokens ?? 0) === 0 && (
              <p className="text-xs text-red-500 mt-3">
                Has usado todos tus tokens gratuitos.
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={BookOpen}
              label="Versículos generados"
              value={tokensUsed}
              accent="bg-blue-100"
            />
            <StatCard
              icon={Heart}
              label="Favoritos"
              value={versesLoading ? '…' : favoritesCount}
              accent="bg-red-100"
            />
            <div className="col-span-2 sm:col-span-1">
              <StatCard
                icon={Clock}
                label="Última generación"
                value={userData?.lastGeneratedAt ? formatDate(userData.lastGeneratedAt) : '—'}
                accent="bg-purple-100"
              />
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-gray-200 p-5 shadow-md">
            <h3 className="text-sm font-semibold text-light-subtle uppercase tracking-wide mb-4">Accesos rápidos</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-accent text-white font-semibold py-3 px-5 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <Sparkles size={16} />
                Generar versículo
              </button>
              <Link
                to="/about"
                className="flex-1 bg-white border border-gray-200 text-light-text font-semibold py-3 px-5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <BookOpen size={16} />
                Acerca de
              </Link>
            </div>
          </div>

          {/* Danger zone */}
          <div className="text-center pb-8">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-light-subtle hover:text-red-500 transition-colors py-2 px-4 rounded-lg hover:bg-red-50"
            >
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
