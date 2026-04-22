import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  useEffect(() => {
    document.title = 'OpenBookDrive - Biblioteca Digital Gratuita'
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between bg-black/80 backdrop-blur-xl border-b border-amber-500/20">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="OpenBookDrive" className="h-10" />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#servicios" className="text-gray-300 hover:text-amber-500 transition">Servicios</a>
          <a href="#testimonios" className="text-gray-300 hover:text-amber-500 transition">Testimonios</a>
          <a href="#faq" className="text-gray-300 hover:text-amber-500 transition">FAQ</a>
          <a href="#donar" className="text-gray-300 hover:text-amber-500 transition">Donar</a>
        </div>
        <Link 
          to="/libros" 
          className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/30"
        >
          Explorar
        </Link>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,119,6,0.15)_0%,transparent_60%)]" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 mb-6">
            📚 Biblioteca Digital Gratuita
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Comparte y Descubre
            </span>
            <br />
            <span className="text-amber-500">Libros Gratis</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            OpenBookDrive es una plataforma comunitaria donde puedes acceder a miles de libros gratuitos, 
            subir los tuyos y recibir recomendaciones personalizadas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/libros"
              className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 bg-size-200 animate-gradient px-8 py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-amber-500/40 hover:scale-105 transition"
              style={{
                background: 'linear-gradient(90deg, #b45309, #d97706, #f59e0b, #d97706)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 4s ease infinite'
              }}
            >
              🚀 Explorar Libros
            </Link>
            <a 
              href="https://github.com/oscaromargp/openbookdrive"
              target="_blank"
              className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-amber-500 hover:bg-amber-500/10 transition"
            >
              ⭐ GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-zinc-900/50 border-y border-amber-500/10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-amber-500">1500+</div>
            <div className="text-gray-400 mt-2 uppercase tracking-wider text-sm">Libros</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-amber-500">12</div>
            <div className="text-gray-400 mt-2 uppercase tracking-wider text-sm">Géneros</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-amber-500">500+</div>
            <div className="text-gray-400 mt-2 uppercase tracking-wider text-sm">Usuarios</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-amber-500">100%</div>
            <div className="text-gray-400 mt-2 uppercase tracking-wider text-sm">Gratis</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            ¿Qué Puedes Hacer?
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            Todas las funcionalidades son completamente gratuitas
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="group relative bg-zinc-900/80 backdrop-blur rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition hover:-translate-y-1">
                <img src={`/images/service_${i+1}.png`} alt={service.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold mb-2">{service.icon} {service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-24 bg-zinc-900/50 overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-16">Lo que dicen nuestros usuarios</h2>
        <div className="flex gap-6 animate-marquee">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="flex-shrink-0 w-80 p-6 bg-zinc-900/80 backdrop-blur rounded-2xl border border-amber-500/20">
              <p className="text-gray-300 mb-4 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-amber-500 text-sm">★★★★★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer flex justify-between items-center font-semibold hover:text-amber-500 transition">
                  {faq.q}
                  <span className="text-amber-500 group-open:rotate-180 transition">▼</span>
                </summary>
                <div className="px-6 pb-4 text-gray-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Donation */}
      <section id="donar" className="py-24 px-4 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">💛 Apoya el Proyecto</h2>
          <p className="text-gray-400 mb-8">
            OpenBookDrive es gratis gracias a la comunidad. Si te es útil, considera donate para mantener los servidores.
          </p>
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-zinc-900 border border-amber-500/30 rounded-xl">
            <span className="text-amber-500 text-2xl">✦</span>
            <code className="text-gray-300 font-mono">rBthUCndKy3Xbb19Ln4xkZeMwusX9NrYfj</code>
            <button 
              onClick={() => navigator.clipboard.writeText('rBthUCndKy3Xbb19Ln4xkZeMwusX9NrYfj')}
              className="px-4 py-2 bg-amber-600 rounded-lg text-sm font-semibold hover:bg-amber-500 transition"
            >
              Copiar
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-bold mb-6">¿Listo para explorar?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            Únete a nuestra comunidad y descubre tu próximo libro favorito.
          </p>
          <Link 
            to="/libros"
            className="inline-block bg-gradient-to-r from-amber-600 to-amber-500 px-10 py-5 rounded-xl font-bold text-xl text-white shadow-xl shadow-amber-500/40 hover:scale-105 transition"
          >
            🚀 Ir a OpenBookDrive
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <img src="/images/logo.png" alt="OpenBookDrive" className="h-10 mb-4" />
            <p className="text-gray-400 text-sm">
              Biblioteca digital gratuita para compartir y descubrir libros.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/libros" className="hover:text-amber-500 transition">Explorar</Link></li>
              <li><a href="#" className="hover:text-amber-500 transition">Subir</a></li>
              <li><a href="#" className="hover:text-amber-500 transition">Solicitar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/privacidad" className="hover:text-amber-500 transition">Privacidad</a></li>
              <li><a href="/terminos" className="hover:text-amber-500 transition">Términos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <a 
              href="https://github.com/oscaromargp/openbookdrive" 
              target="_blank"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © 2026 OpenBookDrive. Todos los derechos reservados.
        </div>
      </footer>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

const services = [
  { icon: '📚', title: 'Descubre', desc: 'Explora nuestra biblioteca organizada por géneros' },
  { icon: '🔍', title: 'Busca', desc: 'Encuentra libros instantáneamente por título o autor' },
  { icon: '📤', title: 'Sube', desc: 'Comparte tus libros con la comunidad' },
  { icon: '📩', title: 'Solicita', desc: 'Pide libros que necesites' },
  { icon: '👤', title: 'Personaliza', desc: 'Configura tus géneros favoritos' },
  { icon: '📥', title: 'Lee y Descarga', desc: 'Acceso libre sin registro obligatorio' },
]

const testimonials = [
  { quote: 'Encontré libros que buscaba hace años y todo gratis.', initials: 'MR', name: 'María Rodríguez' },
  { quote: 'La sección Para Ti me ayuda a descubrir libros que me interesan.', initials: 'JL', name: 'Juan López' },
  { quote: 'Pude subir mis libros de universidad para otros estudiantes.', initials: 'AC', name: 'Ana Carolina' },
  { quote: 'Sistema de solicitudes muy efectivo.', initials: 'PM', name: 'Pedro Martínez' },
]

const faqs = [
  { q: '¿Es realmente gratis?', a: 'Sí, OpenBookDrive es 100% gratuito. No hay costos de suscripción ni anuncios intrusivos.' },
  { q: '¿Cómo puedo subir mis libros?', a: 'Simplemente inicia sesión y serás redirigido a Google Drive donde puedes subir tus PDFs.' },
  { q: '¿Qué formatos soportan?', a: 'Actualmente soportamos PDF. Puedes leer directamente en línea o descargar.' },
  { q: '¿Cómo funciona "Para Ti"?', a: 'En tu perfil selecciona géneros favoritos y recibirás recomendaciones personalizadas.' },
]
