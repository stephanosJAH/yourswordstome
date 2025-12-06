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
      <div className="background-gradient fixed inset-0 z-0"></div>
      <div className="ethereal-blur fixed inset-0 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full px-4 sm:px-8 py-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-light-text">YourWordsToMe</h1>
          </div>
        </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center -mt-10">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-light-text">
            Versículos Bíblicos,
            <span className="font-serif italic text-primary block">Personalizados.</span>
          </h2>
          <p className="max-w-xl mx-auto mt-6 text-lg text-light-subtle leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
            Experimenta las Escrituras de una manera única y personal.
            Usa IA para crear versículos que hablan directamente a tu corazón.
          </p>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-12 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto space-x-3 text-lg animate-fade-in-up"
            style={{animationDelay: '0.4s'}}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Cargando...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Empieza Gratis</span>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            5 generaciones gratuitas • Sin tarjeta de crédito
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">
          Cómo Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-accent" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Elige tu Versículo</h3>
            <p className="text-gray-600">
              Selecciona cualquier versículo bíblico que resuene contigo
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-accent" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Personaliza</h3>
            <p className="text-gray-600">
              Nuestra IA adapta el mensaje incorporando tu nombre de manera natural
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="text-accent" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Comparte</h3>
            <p className="text-gray-600">
              Descarga diseños hermosos y compártelos con el mundo
            </p>
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-2xl my-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">
          Ejemplo de Personalización
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-500 mb-2">Original</p>
            <p className="text-lg text-gray-700 italic">
              "El Señor es mi pastor; nada me faltará."
            </p>
            <p className="text-sm text-gray-500 mt-2">— Salmos 23:1</p>
          </div>
          <div className="bg-gradient-to-br from-accent to-purple-600 p-6 rounded-lg shadow-lg text-white">
            <p className="text-sm opacity-80 mb-2">Personalizado para María</p>
            <p className="text-lg font-semibold">
              "María, el Señor es tu pastor y nada te faltará."
            </p>
            <p className="text-sm opacity-80 mt-2">— Salmos 23:1</p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-primary mb-6">
          Comienza tu Viaje Espiritual Personalizado
        </h2>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crear Mi Primer Versículo
        </button>
      </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-gray-500 border-t">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link to="/about" className="hover:text-primary transition-colors">
              Acerca de
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacidad
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Términos de Uso
            </Link>
          </div>
          <p>&copy; 2024 YourWordsToMe. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">Versión Reina Valera 1960</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
