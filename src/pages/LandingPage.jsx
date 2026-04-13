import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, BookOpen, Share2, Download } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="background-gradient fixed inset-0 z-0" aria-hidden="true"></div>
      <div className="ethereal-blur fixed inset-0 z-0" aria-hidden="true"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full px-4 sm:px-8 py-6">
          <nav className="container mx-auto flex justify-between items-center" aria-label="Navegación principal">
            <span className="text-xl font-bold tracking-tight text-light-text" aria-label="YourWordsToMe - Inicio">YourWordsToMe</span>
            <div className="hidden sm:flex items-center gap-6">
              <Link to="/about" className="text-sm text-light-subtle hover:text-primary transition-colors">Acerca de</Link>
              <Link to="/privacy" className="text-sm text-light-subtle hover:text-primary transition-colors">Privacidad</Link>
            </div>
          </nav>
        </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24 text-center" id="main-content" aria-labelledby="hero-heading">
        <div className="max-w-4xl mx-auto">
          <h1 id="hero-heading" className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-light-text animate-fade-in-up">
            Versículos Bíblicos,
            <span className="font-serif italic text-primary block mt-1">Personalizados.</span>
          </h1>
          <p className="max-w-xl mx-auto mt-8 text-base sm:text-lg text-light-subtle leading-relaxed animate-fade-in-up opacity-0" style={{animationDelay: '0.15s'}}>
            Experimenta las Escrituras de una manera única y personal.
            Usa IA para crear versículos que hablan directamente a tu corazón.
          </p>
          <div className="mt-12 animate-fade-in-up opacity-0" style={{animationDelay: '0.3s'}}>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3 text-lg touch-target"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" aria-hidden="true"></div>
                  <span>Cargando...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} aria-hidden="true" />
                  <span>Empieza Gratis</span>
                </>
              )}
            </button>
            <p className="text-sm text-light-subtle mt-4">
              5 generaciones gratuitas · Sin tarjeta de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 sm:py-20" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-center text-light-text mb-4">
          Cómo <span className="text-primary">Funciona</span>
        </h2>
        <p className="text-center text-light-subtle mb-12 max-w-lg mx-auto">
          Tres pasos simples para recibir una palabra personalizada
        </p>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {[
            { icon: BookOpen, title: '1. Elige tu Versículo', desc: 'Selecciona cualquier versículo bíblico que resuene contigo', delay: '0s' },
            { icon: Sparkles, title: '2. Personaliza', desc: 'Nuestra IA adapta el mensaje incorporando tu nombre de manera natural', delay: '0.1s' },
            { icon: Share2, title: '3. Comparte', desc: 'Descarga diseños hermosos y compártelos con el mundo', delay: '0.2s' },
          ].map((item, i) => (
            <div 
              key={i} 
              className="glass-card glass-card-hover text-center p-8 animate-fade-in-up opacity-0"
              style={{ animationDelay: item.delay }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3">
                <item.icon className="text-primary" size={28} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-light-text mb-2">{item.title}</h3>
              <p className="text-sm text-light-subtle leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example */}
      <section className="container mx-auto px-4 py-16 sm:py-20" aria-labelledby="example-heading">
        <div className="glass-card p-8 sm:p-12 max-w-4xl mx-auto">
          <h2 id="example-heading" className="text-3xl sm:text-4xl font-bold text-center text-light-text mb-4">
            Ejemplo de <span className="text-primary">Personalización</span>
          </h2>
          <p className="text-center text-light-subtle mb-10 max-w-md mx-auto">
            Mira cómo un versículo cobra vida con tu nombre
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-elevated p-6 sm:p-8">
              <span className="inline-block text-xs font-semibold text-light-subtle uppercase tracking-widest mb-3 bg-gray-100 px-3 py-1 rounded-full">Original</span>
              <blockquote>
                <p className="text-lg text-light-text font-serif italic leading-relaxed">
                  "El Señor es mi pastor; nada me faltará."
                </p>
                <footer className="text-sm text-light-subtle mt-3">— Salmos 23:1</footer>
              </blockquote>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary-dark p-6 sm:p-8 rounded-2xl shadow-lg shadow-primary/20 text-white">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 bg-white/20 px-3 py-1 rounded-full">Personalizado para María</span>
              <blockquote>
                <p className="text-lg font-semibold leading-relaxed">
                  "María, el Señor es tu pastor y nada te faltará."
                </p>
                <footer className="text-sm opacity-80 mt-3">— Salmos 23:1</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16 sm:py-24 text-center" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-light-text mb-3">
          Comienza tu Viaje <span className="text-primary">Espiritual</span>
        </h2>
        <p className="text-light-subtle mb-8 max-w-md mx-auto">
          Descubre cómo la Palabra de Dios puede hablarte de manera personal
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-secondary hover:bg-secondary/90 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
        >
          Crear Mi Primer Versículo
        </button>
      </section>

        {/* Footer */}
        <footer className="border-t border-gray-200/60 mt-8" role="contentinfo">
          <div className="container mx-auto px-4 py-8">
            <nav className="flex flex-wrap justify-center gap-6 mb-4" aria-label="Enlaces del pie de página">
              <Link to="/about" className="text-sm text-light-subtle hover:text-primary transition-colors">
                Acerca de
              </Link>
              <Link to="/privacy" className="text-sm text-light-subtle hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link to="/terms" className="text-sm text-light-subtle hover:text-primary transition-colors">
                Términos de Uso
              </Link>
            </nav>
            <p className="text-center text-sm text-light-subtle">&copy; {new Date().getFullYear()} YourWordsToMe. Todos los derechos reservados.</p>
            <p className="text-center text-xs text-light-subtle mt-1">Versión Reina Valera 1960</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
