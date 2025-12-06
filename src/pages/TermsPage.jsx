import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const TermsPage = () => {
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
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-10 h-10 text-primary" />
              <h2 
                className="text-4xl md:text-5xl font-bold text-light-text"
                style={{ viewTransitionName: 'page-title-terms' }}
              >
                Términos de Uso
              </h2>
            </div>

            <p className="text-light-text/60 mb-8">
              Última actualización: 24 de noviembre de 2024
            </p>

            <div className="space-y-8 text-light-text/80 leading-relaxed">
              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">1. Aceptación de los Términos</h3>
                <p>
                  Al acceder y utilizar YourWordsToMe, aceptas estar sujeto a estos Términos de Uso. 
                  Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestra aplicación.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">2. Descripción del Servicio</h3>
                <p className="mb-3">
                  YourWordsToMe es una aplicación que utiliza inteligencia artificial para:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Generar recomendaciones de versículos bíblicos personalizados.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Crear diseños visuales con versículos bíblicos.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Permitir compartir y descargar contenido inspirador.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">3. Requisitos de Cuenta</h3>
                <div className="space-y-3">
                  <p>Para utilizar YourWordsToMe, debes:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Tener al menos 13 años de edad.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Proporcionar información precisa y actualizada durante el registro.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Mantener la seguridad de tu cuenta y contraseña.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">4. Uso Aceptable</h3>
                <p className="mb-3">Te comprometes a:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Utilizar la aplicación solo para fines legales y apropiados.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>No manipular, hackear o comprometer la seguridad de la aplicación.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>No utilizar la aplicación para difundir contenido ofensivo o dañino.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Respetar los derechos de autor y propiedad intelectual.</span>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <h3 className="text-2xl font-semibold text-light-text">5. Restricciones</h3>
                </div>
                <p className="mb-3">No está permitido:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Copiar, modificar o distribuir el código fuente de la aplicación.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Realizar ingeniería inversa de la aplicación.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Usar bots o scripts automatizados sin autorización.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Intentar sobrecargar nuestros servidores o infraestructura.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Vender o comercializar el acceso a la aplicación sin permiso.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">6. Propiedad Intelectual</h3>
                <p className="mb-3">
                  Todo el contenido, diseños, logos y marcas en YourWordsToMe son propiedad de la aplicación 
                  y están protegidos por leyes de propiedad intelectual.
                </p>
                <p>
                  Los versículos bíblicos provienen de fuentes públicas y su uso está sujeto a las respectivas 
                  licencias de las traducciones bíblicas utilizadas.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">7. Contenido Generado por IA</h3>
                <p>
                  Las recomendaciones de versículos son generadas por inteligencia artificial y tienen fines 
                  informativos e inspiracionales. Si bien nos esforzamos por la precisión, te recomendamos 
                  verificar los versículos con una fuente bíblica autorizada.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">8. Limitación de Responsabilidad</h3>
                <p className="mb-3">
                  YourWordsToMe se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos 
                  responsables de:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Interrupciones o errores en el servicio.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Pérdida de datos o contenido.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Daños derivados del uso o imposibilidad de uso de la aplicación.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Interpretaciones o aplicaciones de los versículos recomendados.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">9. Modificaciones del Servicio</h3>
                <p>
                  Nos reservamos el derecho de modificar, suspender o discontinuar cualquier parte de la 
                  aplicación en cualquier momento, con o sin previo aviso.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">10. Terminación</h3>
                <p className="mb-3">
                  Podemos suspender o terminar tu acceso a YourWordsToMe si:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Violas estos Términos de Uso.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Realizas actividades que dañen la aplicación o a otros usuarios.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Lo solicitas mediante la eliminación de tu cuenta.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">11. Ley Aplicable</h3>
                <p>
                  Estos términos se rigen por las leyes aplicables en la jurisdicción donde operamos. 
                  Cualquier disputa será resuelta en los tribunales competentes de dicha jurisdicción.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-light-text mb-4">12. Cambios a los Términos</h3>
                <p>
                  Podemos actualizar estos Términos de Uso periódicamente. El uso continuado de la aplicación 
                  después de los cambios constituye tu aceptación de los nuevos términos.
                </p>
              </section>

              <section className="pt-6 border-t border-primary/20">
                <h3 className="text-2xl font-semibold text-light-text mb-4">Contacto</h3>
                <p>
                  Si tienes preguntas sobre estos Términos de Uso, por favor contáctanos.
                </p>
              </section>

              <section className="pt-6 border-t border-primary/20 bg-primary/5 p-6 rounded-lg">
                <p className="text-center text-light-text">
                  Al usar YourWordsToMe, aceptas estos términos y te comprometes a utilizarla de manera 
                  responsable y respetuosa, en el espíritu de compartir la Palabra de Dios con amor y sabiduría.
                </p>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-light-text/60">
          <p>&copy; 2024 YourWordsToMe. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default TermsPage;
