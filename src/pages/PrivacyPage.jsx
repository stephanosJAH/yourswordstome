import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';

const PrivacyPage = () => {
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
            <h1 className="text-xl font-bold tracking-tight text-light-text">YourWordsForMe</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="glass-card p-8 md:p-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 text-primary" />
              <h2 
                className="text-4xl md:text-5xl font-bold text-light-text"
                style={{ viewTransitionName: 'page-title-privacy' }}
              >
                Política de Privacidad
              </h2>
            </div>

            <p className="text-light-text/60 mb-8">
              Última actualización: 24 de noviembre de 2024
            </p>

            <div className="space-y-8 text-light-text/80 leading-relaxed">
              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">Introducción</h3>
                <p>
                  En YourWordsForMe, nos tomamos muy en serio tu privacidad. Esta política describe cómo 
                  recopilamos, usamos y protegemos tu información personal cuando utilizas nuestra aplicación.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold text-light-text">Información que Recopilamos</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-light-text mb-2">1. Información de Autenticación</h4>
                    <p>
                      Cuando te registras con Google, recopilamos tu nombre, dirección de correo electrónico 
                      y foto de perfil proporcionados por Google.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-light-text mb-2">2. Información de Uso</h4>
                    <p>
                      Almacenamos los versículos que generas y las preferencias personales que configures 
                      (como tu nombre personalizado) para mejorar tu experiencia.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-light-text mb-2">3. Datos Técnicos</h4>
                    <p>
                      Recopilamos información sobre tu dispositivo, navegador y dirección IP para mantener 
                      la seguridad y funcionalidad de la aplicación.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold text-light-text">Cómo Usamos tu Información</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Proporcionar y personalizar los servicios de YourWordsForMe.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Generar versículos bíblicos relevantes basados en tus entradas.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Mejorar y optimizar la experiencia del usuario.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Mantener la seguridad de la aplicación y prevenir fraudes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Comunicarnos contigo sobre actualizaciones o cambios importantes.</span>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold text-light-text">Protección de tus Datos</h3>
                </div>
                <p className="mb-3">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Encriptación de datos en tránsito y en reposo.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Autenticación segura a través de Firebase Authentication.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Acceso restringido a datos personales solo al personal autorizado.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Monitoreo regular de vulnerabilidades de seguridad.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">Compartir Información</h3>
                <p>
                  <strong>No vendemos ni compartimos tu información personal con terceros</strong> con fines 
                  comerciales. Solo compartimos datos con:
                </p>
                <ul className="space-y-3 mt-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Proveedores de servicios necesarios (Firebase, servicios de IA) bajo estrictos acuerdos de confidencialidad.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Autoridades legales cuando sea requerido por ley.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">Tus Derechos</h3>
                <p className="mb-3">Tienes derecho a:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Acceder a tu información personal.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Corregir información inexacta.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Solicitar la eliminación de tus datos.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Retirar tu consentimiento en cualquier momento.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Exportar tus datos en un formato legible.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">Cookies y Tecnologías Similares</h3>
                <p>
                  Utilizamos cookies y tecnologías similares para mantener tu sesión activa, recordar tus 
                  preferencias y mejorar el rendimiento de la aplicación. Puedes gestionar las cookies desde 
                  la configuración de tu navegador.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">Retención de Datos</h3>
                <p>
                  Conservamos tu información personal mientras tu cuenta esté activa o según sea necesario 
                  para proporcionarte servicios. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">Cambios a esta Política</h3>
                <p>
                  Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios 
                  significativos mediante un aviso en la aplicación o por correo electrónico.
                </p>
              </section>

              <section className="pt-6 border-t border-primary/20">
                <h3 className="text-2xl font-semibold text-light-text mb-4">Contacto</h3>
                <p>
                  Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu información, 
                  por favor contáctanos.
                </p>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-light-text/60">
          <p>&copy; 2024 YourWordsForMe. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPage;
