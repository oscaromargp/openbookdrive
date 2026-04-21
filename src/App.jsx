import { useState, useEffect, useMemo } from 'react'
import { useGoogleDrive } from './hooks/useGoogleDrive'
import { useAuth } from './hooks/useAuth'
import Hero from './components/Hero'
import BookRow from './components/BookRow'
import BookModal from './components/BookModal'
import SearchBar from './components/SearchBar'
import UploadModal from './components/UploadModal'
import RequestModal from './components/RequestModal'
import RequestList from './components/RequestList'
import AuthModal from './components/AuthModal'

export default function App() {
  const { books, booksByGenre, loading, error, isDemo } = useGoogleDrive()
  const { user, login, logout, updateStats } = useAuth()
  const [selectedBook, setSelectedBook] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showRequest, setShowRequest] = useState(false)
  const [showRequestList, setShowRequestList] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showLanding, setShowLanding] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterQuery, setFilterQuery] = useState('')

  const featuredBook = books[0] || null
  const genres = Object.keys(booksByGenre)
  const allGenres = [...genres, 'Solicitudes']

  const filteredBooks = useMemo(() => {
    if (!filterQuery.trim()) return books
    const query = filterQuery.toLowerCase()
    
    return books.filter(book => {
      const title = (book.title || book.name || '').toLowerCase()
      const author = (book.author || '').toLowerCase()
      const genre = (book.genre || '').toLowerCase()
      
      if (filterType === 'title') return title.includes(query)
      if (filterType === 'author') return author.includes(query)
      if (filterType === 'genre') return genre.includes(query)
      return title.includes(query) || author.includes(query) || genre.includes(query)
    })
  }, [books, filterQuery, filterType])

  const filteredBooksByGenre = useMemo(() => {
    if (filterType === 'genre' && filterQuery.trim()) {
      return filteredBooks.reduce((acc, book) => {
        if (!acc[book.genre]) acc[book.genre] = []
        acc[book.genre].push(book)
        return acc
      }, {})
    }
    return booksByGenre
  }, [filteredBooks, booksByGenre, filterType, filterQuery])

  useEffect(() => {
    if (user && showLanding) {
      setShowLanding(false)
    }
  }, [user, showLanding])

  const handleBookClick = (book) => {
    setSelectedBook(book)
  }

  const handleDownload = (book) => {
    if (user) {
      updateStats('download', book.title || book.name)
    } else {
      setShowLoginPrompt(true)
    }
  }

  const handleSearchSelect = (book) => {
    setSearchResults([book])
    setShowSearch(false)
  }

  const handleOpenUpload = () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setShowUpload(true)
  }

  const handleOpenRequest = () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setShowRequest(true)
  }

  const handleLoginSuccess = (user) => {
    setShowAuth(false)
    setShowLanding(false)
  }

  const handleExplore = () => {
    setShowLanding(false)
  }

  if (showLanding && !user) {
    return (
      <LandingPage 
        onLogin={() => setShowAuth(true)}
        onExplore={handleExplore}
        onDownload={handleDownload}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/95 to-[#0a0a0f]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button onClick={() => setShowLanding(true)} className="flex items-center gap-2">
            <span className="text-red-600 font-black text-2xl tracking-tight">Open</span>
            <span className="text-white font-black text-2xl tracking-tight">BookDrive</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-8">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 flex-1">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-gray-400 text-sm outline-none"
            >
              <option value="all">Todo</option>
              <option value="title">Título</option>
              <option value="author">Autor</option>
              <option value="genre">Género</option>
            </select>
            <input 
              type="text"
              placeholder="Buscar libros..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-transparent text-white text-sm outline-none flex-1 placeholder-gray-500"
            />
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setShowRequestList(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="hidden lg:inline">Solicitudes</span>
          </button>

          <button
            onClick={handleOpenUpload}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden lg:inline">Subir</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 hidden md:block">
                {user.email}
              </span>
              <button
                onClick={() => { logout(); setShowLanding(true) }}
                className="text-sm text-gray-500 hover:text-white transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden md:inline">Login</span>
            </button>
          )}
        </div>
      </nav>

      {showSearch && (
        <div className="md:hidden fixed top-20 left-4 right-4 z-30">
          <SearchBar onSelect={handleSearchSelect} onClose={() => setShowSearch(false)} />
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Cargando biblioteca...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-8 text-center">
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h2 className="text-xl font-bold text-red-400">Error de conexión</h2>
          <p className="text-gray-400 max-w-md text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {searchResults ? (
            <div className="pt-24 px-4 md:px-8 pb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Resultados de búsqueda</h2>
                <button
                  onClick={() => setSearchResults(null)}
                  className="text-gray-500 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {searchResults.map((book, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleBookClick(book)}
                    className="flex-shrink-0 w-40 cursor-pointer group"
                  >
                    <div className="aspect-[2/3] rounded-md overflow-hidden bg-card">
                      <img
                        src={book.cover || book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-white mt-2 truncate">{book.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Hero book={featuredBook} onOpen={handleBookClick} />
              
              <div className="py-8">
                {genres.length === 0 ? (
                  <div className="text-center text-gray-500 py-20 px-4">
                    <p className="text-lg mb-4">No se encontraron libros en la carpeta</p>
                    <p className="text-sm mb-8">Asegúrate de que la carpeta sea pública y tenga archivos</p>
                    <button
                      onClick={handleOpenUpload}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Subir primer libro
                    </button>
                  </div>
                ) : (
                  (filterType === 'genre' && filterQuery.trim() ? Object.keys(filteredBooksByGenre) : genres).map(genre => (
                    <BookRow
                      key={genre}
                      genre={genre}
                      books={filteredBooksByGenre[genre] || []}
                      onBookClick={handleBookClick}
                    />
                  ))
                )}
              </div>

              <section className="py-8 px-4 md:px-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Colabora con la comunidad</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <button
                    onClick={handleOpenUpload}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition text-left"
                  >
                    <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Subir un libro</h3>
                      <p className="text-sm text-gray-500">Comparte tus libros con la comunidad</p>
                    </div>
                  </button>

                  <button
                    onClick={handleOpenRequest}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition text-left"
                  >
                    <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Solicitar libro</h3>
                      <p className="text-sm text-gray-500">Pide un libro que necesitas</p>
                    </div>
                  </button>
                </div>
              </section>
            </>
          )}
        </>
      )}

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
        <p>OpenBookDrive - Comparte y descubre libros</p>
        <p className="mt-1">Powered by Google Drive + OpenLibrary</p>
      </footer>

      <BookModal 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)}
        onDownload={handleDownload}
      />

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} />
      )}

      {showRequest && (
        <RequestModal onClose={() => setShowRequest(false)} />
      )}

      {showRequestList && (
        <RequestList onClose={() => setShowRequestList(false)} />
      )}

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="bg-[#0f0f1a] rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-2">Identifícate para descargar</h3>
            <p className="text-gray-400 text-sm mb-4">
              Ingresa tu email para registrar quién descarga cada libro
            </p>
            <button
              onClick={() => {
                setShowLoginPrompt(false)
                setShowAuth(true)
              }}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function LandingPage({ onLogin, onExplore, onDownload }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 10 + Math.random() * 10
    }))
    setParticles(newParticles)
  }, [])

  const copyXRP = () => {
    navigator.clipboard.writeText('rBthUCndKy3Xbb19Ln4xkZeMwusX9NrYfj')
  }

  return (
    <div className="min-h-screen bg-[#030307] text-white overflow-x-hidden">
      <div className="particles" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.left}%`,
            width: 4, height: 4,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: `particle-float ${p.duration}s infinite linear`,
            animationDelay: `${p.delay}s`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes particle-float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass">
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-black text-2xl tracking-tight">Open</span>
          <span className="text-white font-black text-2xl tracking-tight">BookDrive</span>
        </div>
        <button onClick={onLogin} className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition">
          Iniciar Sesión
        </button>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 40%)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-400">Biblioteca pública activa</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="text-gradient">Comparte</span> conocimiento,<br/>
              <span className="text-red-500">transforma</span> vidas
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              El conocimiento pertenece a todos. OpenBookDrive es una plataforma donde la comunidad comparte libros libremente, sin barreras ni restricciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={onExplore} className="btn-primary px-8 py-4 rounded-xl font-bold text-lg btn-glow transition" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
                Explorar Biblioteca
              </button>
              <button onClick={onLogin} className="glass px-8 py-4 rounded-xl font-semibold text-gray-300 hover:text-white transition">
                Subir un Libro
              </button>
            </div>
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">∞</p>
                <p className="text-sm text-gray-500">Libros Disponibles</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-gray-500">Gratuito</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">🌍</p>
                <p className="text-sm text-gray-500">Acceso Universal</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="book-float relative z-10" style={{ animation: 'book-float 8s ease-in-out infinite' }}>
              <div className="w-64 h-80 mx-auto glass-card rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 60px rgba(220, 38, 38, 0.3)' }}>
                <div className="text-center p-6">
                  <div className="w-20 h-24 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2zm0 14H5V5c0-.806.55-.988 1-1h13v12z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white">Biblioteca Abierta</p>
                  <p className="text-sm text-gray-500">Para todos</p>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/20 blur-3xl rounded-full"></div>
          </div>
        </div>
        <style>{`
          @keyframes book-float {
            0%, 100% { transform: translateY(0) rotateY(0deg); }
            50% { transform: translateY(-15px) rotateY(5deg); }
          }
        `}</style>
      </section>

      <section className="py-24" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(220, 38, 38, 0.05) 50%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">¿Por qué <span className="text-red-500">compartir</span>?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">El conocimiento es poder, pero solo cuando es accesible</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📚', title: 'Democratizar el Acceso', desc: 'Millones de personas no tienen acceso a bibliotecas. Compartir libros elimina barreras económicas y geográficas.' },
              { icon: '🤝', title: 'Fortalecer Comunidades', desc: 'Cuando compartimos conocimiento, creamos comunidades más fuertes, informadas y capaces de transformar su entorno.' },
              { icon: '⚡', title: 'Acelerar el Aprendizaje', desc: 'Un libro compartido puede inspirar a decenas de personas. El conocimiento se multiplica cuando se distribuye libremente.' }
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Apoya este <span className="text-red-500">proyecto</span></h2>
          <p className="text-xl text-gray-400 mb-8">Tu contribución ayuda a mantener la plataforma operativa.</p>
          <div className="glass-card rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #23292f 0%, #1a1f25 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-2xl font-bold text-white mb-4">Donaciones en XRP</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
                <p className="text-gray-500 text-xs mb-1">Dirección XRP:</p>
                <p className="text-white">rBthUCndKy3Xbb19Ln4xkZeMwusX9NrYfj</p>
              </div>
              <button onClick={copyXRP} className="px-6 py-3 rounded-xl text-white font-semibold" style={{ background: 'rgba(255,255,255,0.1)' }}>
                Copiar
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2024 OpenBookDrive. Código abierto.</p>
        </div>
      </footer>
    </div>
  )
}