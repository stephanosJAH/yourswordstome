import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, BookOpen, Sparkles } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  // Scroll to top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="background-gradient fixed inset-0 z-0"></div>
      <div className="ethereal-blur fixed inset-0 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full px-4 sm:px-8 py-6">
          <div className="container mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-light-text hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-light-text">YourWordsToMe</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="glass-card p-8 md:p-12 animate-fade-in-up">
            <h2 
              className="text-4xl md:text-5xl font-bold text-light-text mb-6"
              style={{ viewTransitionName: 'page-title-about' }}
            >
              Acerca de <span className="text-primary font-serif italic">YourWordsToMe</span>
            </h2>

            <div className="space-y-8 text-light-text/80 text-lg leading-relaxed">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold text-light-text">Nuestra Misión</h3>
                </div>
                <p>
                  YourWordsToMe nace del deseo de conectar a las personas con la Palabra de Dios de una manera 
                  personal y significativa. Creemos que cada momento de nuestra vida tiene un versículo que puede 
                  iluminarlo, consolarlo o inspirarlo.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold text-light-text">¿Qué Hacemos?</h3>
                </div>
                <p>
                  Utilizamos tecnología de inteligencia artificial avanzada para ayudarte a descubrir versículos 
                  bíblicos que resuenen con tus emociones, situaciones y necesidades del momento. Simplemente 
                  comparte cómo te sientes o qué estás atravesando, y te presentaremos versículos relevantes de 
                  una manera visual y personalizada.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold text-light-text">Nuestra Visión</h3>
                </div>
                <p>
                  Aspiramos a ser un puente entre la sabiduría eterna de las Escrituras y las necesidades 
                  cotidianas de las personas. Queremos hacer que la Biblia sea más accesible, relevante y 
                  personal para todos, sin importar dónde se encuentren en su camino espiritual.
                </p>
              </section>

              <section className="pt-6 border-t border-primary/20">
                <h3 className="text-2xl font-semibold text-light-text mb-4">Características</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Versículos Personalizados:</strong> Encuentra pasajes bíblicos adaptados a tu situación actual.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Diseños Visuales:</strong> Crea imágenes hermosas con versículos para compartir o guardar.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Múltiples Estilos:</strong> Elige entre diferentes diseños que se adapten a tu gusto.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Comparte Fácilmente:</strong> Difunde palabras de esperanza y fe con tus seres queridos.</span>
                  </li>
                </ul>
              </section>

              <section className="pt-6 border-t border-primary/20">
                <p className="text-center italic text-light-text">
                  "Porque la palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos..."
                  <br />
                  <span className="text-sm text-light-text/60">Hebreos 4:12</span>
                </p>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-light-text/60">
          <p>&copy; 2024 YourWordsToMe. Hecho con ❤️ para la gloria de Dios.</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
