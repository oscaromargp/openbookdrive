import { useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useGoogleDrive } from './hooks/useGoogleDrive'
import { useAuth } from './hooks/useAuth'
import Fuse from 'fuse.js'
import Hero from './components/Hero'
import BookRow from './components/BookRow'
import BookModal from './components/BookModal'
import SearchBar from './components/SearchBar'
import UploadModal from './components/UploadModal'
import RequestModal from './components/RequestModal'
import RequestList from './components/RequestList'
import AuthModal from './components/AuthModal'
import ProfileModal from './components/ProfileModal'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'

export default function App() {
  return (
    <Routes>
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="*" element={<MainApp />} />
    </Routes>
  )
}

function MainApp() {
  const { books, booksByGenre, loading, error, isDemo } = useGoogleDrive()
  const { user, login, logout, updateStats } = useAuth()
  const [selectedBook, setSelectedBook] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showRequest, setShowRequest] = useState(false)
  const [showRequestList, setShowRequestList] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showLanding, setShowLanding] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterQuery, setFilterQuery] = useState('')
  const [sortBy, setSortBy] = useState('title')

  const featuredBook = books[0] || null
  const genres = Object.keys(booksByGenre)
  const favoriteGenres = user?.profile?.favoriteGenres || []

  const booksForYou = useMemo(() => {
    if (favoriteGenres.length === 0) return []
    return books.filter(book => 
      favoriteGenres.includes(book.genre)
    ).slice(0, 10)
  }, [books, favoriteGenres])

  const fuse = useMemo(() => new Fuse(books, {
    keys: ['title', 'name', 'author', 'genre'],
    threshold: 0.3,
    includeScore: true
  }), [books])

  const filteredBooks = useMemo(() => {
    if (!filterQuery.trim()) return books
    
    let results
    if (filterType === 'all') {
      const fuseResults = fuse.search(filterQuery)
      results = fuseResults.map(r => r.item)
    } else {
      const query = filterQuery.toLowerCase()
      results = books.filter(book => {
        const title = (book.title || book.name || '').toLowerCase()
        const author = (book.author || '').toLowerCase()
        const genre = (book.genre || '').toLowerCase()
        
        if (filterType === 'title') return title.includes(query)
        if (filterType === 'author') return author.includes(query)
        if (filterType === 'genre') return genre.includes(query)
        return title.includes(query) || author.includes(query) || genre.includes(query)
      })
    }
    
    return [...results].sort((a, b) => {
      if (sortBy === 'title') return (a.title || a.name || '').localeCompare(b.title || b.name || '')
      if (sortBy === 'author') return (a.author || '').localeCompare(b.author || '')
      if (sortBy === 'recent') return (b.createdTime || '').localeCompare(a.createdTime || '')
      return 0
    })
  }, [books, filterQuery, filterType, fuse, sortBy])

  const isSearching = filterQuery.trim().length > 0

  const filteredBooksByGenre = useMemo(() => {
    if (isSearching) {
      return filteredBooks.reduce((acc, book) => {
        if (!acc[book.genre]) acc[book.genre] = []
        acc[book.genre].push(book)
        return acc
      }, {})
    }
    return booksByGenre
  }, [filteredBooks, booksByGenre, isSearching])

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
        onUpload={handleOpenUpload}
        onDownload={handleDownload}
        bookCount={books.length}
        books={books}
      />
    )
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <nav className="fixed top-0 left-0 right-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between bg-gradient-to-b from-dark via-dark/95 to-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 hover:bg-amber-500/10 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button onClick={() => setShowLanding(true)} className="flex items-center gap-2">
            <span className="text-primary font-black text-2xl tracking-tight">Open</span>
            <span className="text-white font-black text-2xl tracking-tight">BookDrive</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 max-w-3xl mx-8">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 flex-1 border border-white/5">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-amber-400 text-sm outline-none cursor-pointer"
            >
              <option value="all">Todo</option>
              <option value="title">Título</option>
              <option value="author">Autor</option>
              <option value="genre">Género</option>
            </select>
            <div className="w-px h-4 bg-white/10"></div>
            <input 
              type="text"
              placeholder="Buscar libros por título, autor o género..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-transparent text-white text-sm outline-none flex-1 placeholder-gray-500"
            />
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 text-gray-400 text-sm px-3 py-2 rounded-lg border border-white/5 outline-none cursor-pointer hover:text-amber-400 transition"
          >
            <option value="title">A-Z</option>
            <option value="recent">Más Recientes</option>
            <option value="author">Autor</option>
          </select>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={handleOpenUpload}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition border border-amber-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="hidden lg:inline">Solicitar</span>
          </button>
          
          <button
            onClick={() => setShowLanding(false)}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition border border-amber-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden lg:inline">Biblioteca</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-amber-400 transition"
                title="Configurar perfil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden md:block">
                  {user.profile?.name || user.email.split('@')[0]}
                </span>
              </button>
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
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition text-sm font-medium text-white"
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
        <LoadingSkeleton />
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-8 text-center pt-20">
          <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h2 className="text-xl font-bold text-primary-light">Error de conexión</h2>
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
                  <BookCard key={idx} book={book} onClick={handleBookClick} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {!isSearching && <Hero book={featuredBook} onOpen={handleBookClick} />}
              
              {!isSearching && booksForYou.length > 0 && (
                <div className="py-8 px-4 md:px-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xl font-bold text-white">Para Ti</h2>
                    <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                      Basado en tus géneros favoritos
                    </span>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {booksForYou.map(book => (
                      <BookCard key={book.id} book={book} onClick={handleBookClick} />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="py-8">
                {genres.length === 0 ? (
                  <div className="text-center text-gray-500 py-20 px-4">
                    <p className="text-lg mb-4">No se encontraron libros en la carpeta</p>
                    <p className="text-sm mb-8">Asegúrate de que la carpeta sea pública y tenga archivos</p>
                    <button
                      onClick={handleOpenUpload}
                      className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition"
                    >
                      Subir primer libro
                    </button>
                  </div>
                ) : isSearching ? (
                  <div className="px-4 md:px-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">
                        Resultados de búsqueda ({filteredBooks.length})
                      </h2>
                      <button
                        onClick={() => { setFilterQuery(''); setFilterType('all'); }}
                        className="text-sm text-primary hover:text-primary-light transition"
                      >
                        Limpiar búsqueda
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {filteredBooks.map(book => (
                        <BookCard key={book.id} book={book} onClick={handleBookClick} />
                      ))}
                    </div>
                  </div>
                ) : (
                  Object.keys(filteredBooksByGenre).map(genre => (
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
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <a href="/terminos" className="hover:text-amber-400 transition">Términos</a>
          <a href="/privacidad" className="hover:text-amber-400 transition">Privacidad</a>
          <a href="https://github.com/oscaromargp/openbookdrive/releases" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">Changelog</a>
        </div>
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

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}

      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="bg-card rounded-2xl p-6 max-w-sm w-full text-center border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <svg className="w-12 h-12 text-gold mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="pt-24 px-4 md:px-8">
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-2"></div>
        <div className="h-96 bg-gray-800/50 rounded-2xl animate-pulse"></div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="mb-8">
          <div className="h-6 w-48 bg-gray-800 rounded animate-pulse mb-4"></div>
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map(j => (
              <div key={j} className="flex-shrink-0 w-36 md:w-40">
                <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="mt-3 h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function BookCard({ book, onClick }) {
  const cover = book?.cover || book?.thumbnail
  const fileType = getFileType(book?.rawName || book?.name || '')
  const title = book?.title || book?.name || 'Sin título'
  
  const isPlaceholder = !cover || cover.includes('drive.google.com/thumbnail')

  return (
    <div
      onClick={() => onClick && onClick(book)}
      className="relative flex-shrink-0 w-36 md:w-40 cursor-pointer group"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-amber-900/30 group-hover:-translate-y-2">
        {isPlaceholder ? (
          <div className="w-full h-full relative overflow-hidden" style={{
            background: generateGradient(title)
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-16 border-2 border-white/30 rounded flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-white font-medium text-xs leading-tight line-clamp-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                {title}
              </p>
            </div>
            <div className="absolute top-2 right-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white/80 font-medium">
                {fileType}
              </span>
            </div>
          </div>
        ) : (
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover"
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = generatePlaceholderHTML(title, fileType)
            }}
          />
        )}
        
        {!isPlaceholder && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-600/90 text-white font-medium">
              {fileType}
            </span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          {book?.author && (
            <p className="text-xs text-gray-300 truncate mb-1">{book.author}</p>
          )}
          {book?.year && (
            <p className="text-xs text-gray-500">{book.year}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/50 text-amber-300">
              {book?.genre || 'General'}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-7 h-7 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-amber-400 transition-colors">
          {title}
        </h3>
        {book?.author && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {book.author}
          </p>
        )}
      </div>
    </div>
  )
}

function getFileType(filename) {
  const ext = filename?.split('.')?.pop()?.toLowerCase()
  const types = {
    pdf: 'PDF',
    epub: 'EPUB',
    mobi: 'MOBI',
    docx: 'DOCX',
    doc: 'DOC',
  }
  return types[ext] || 'PDF'
}

function generateGradient(title) {
  const gradients = [
    'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #14b8a6 100%)',
    'linear-gradient(135deg, #451a03 0%, #78350f 50%, #d97706 100%)',
    'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
    'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
    'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
  ]
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

function generatePlaceholderHTML(title, fileType) {
  return `
    <div class="w-full h-full relative overflow-hidden" style="${generateGradient(title)}">
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30" />
      <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <div class="w-12 h-16 border-2 border-white/30 rounded flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="text-white font-medium text-xs leading-tight line-clamp-3" style="font-family: 'Playfair Display', serif;">
          ${title}
        </p>
      </div>
      <div class="absolute top-2 right-2">
        <span class="text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white/80 font-medium">
          ${fileType}
        </span>
      </div>
    </div>
  `
}

function LandingPage({ onLogin, onExplore, onUpload, onDownload, bookCount, books }) {
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

  const featuredTitles = [
    'Isaac Asimov - Fundación Completa',
    'Daniel Goleman - Inteligencia Emocional',
    'Robert Greene - Las 48 Leyes del Poder',
    'Brian Tracy - El Arte de Cerrar la Venta',
    'Stephen Covey - Los 7 Hábitos',
    'Robert Kiyosaki - El Juego del Dinero',
    'Gary Keller - The One Thing',
    'Napoleón Hill - Piense y Hágase Rico'
  ]

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <div className="particles" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.left}%`,
            width: 4, height: 4,
            background: 'rgba(251, 191, 36, 0.15)',
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

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-primary font-black text-2xl tracking-tight">Open</span>
          <span className="text-white font-black text-2xl tracking-tight">BookDrive</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/terminos" className="text-sm text-gray-500 hover:text-amber-400 transition">Términos</a>
          <a href="/privacidad" className="text-sm text-gray-500 hover:text-amber-400 transition">Privacidad</a>
          <button onClick={onLogin} className="px-5 py-2 bg-primary hover:bg-primary-dark rounded-lg text-sm font-semibold transition">
            Iniciar Sesión
          </button>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(217, 119, 6, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 40%)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-400">Biblioteca pública activa</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span style={{ background: 'linear-gradient(135deg, #fff 0%, #d1d5db 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Comparte</span> conocimiento,<br/>
              <span className="text-primary-light">transforma</span> vidas
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              El conocimiento pertenece a todos. OpenBookDrive es una plataforma donde la comunidad comparte libros libremente, sin barreras ni restricciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={onExplore} className="px-8 py-4 rounded-xl font-bold text-lg transition bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg shadow-amber-900/30" style={{ boxShadow: '0 0 30px rgba(217, 119, 6, 0.3)' }}>
                📚 Explorar Biblioteca ({bookCount || 160}+ libros)
              </button>
              <button onClick={onUpload} className="px-8 py-4 rounded-xl font-semibold text-gray-300 hover:text-white transition" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                📤 Subir un Libro
              </button>
            </div>
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-light">{bookCount || '∞'}</p>
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
              <div className="w-64 h-80 mx-auto rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 60px rgba(217, 119, 6, 0.3)' }}>
                <div className="text-center p-6">
                  <div className="w-20 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2zm0 14H5V5c0-.806.55-.988 1-1h13v12z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white">Biblioteca Abierta</p>
                  <p className="text-sm text-gray-500">Para todos</p>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-600/20 blur-3xl rounded-full"></div>
          </div>
        </div>
        <style>{`
          @keyframes book-float {
            0%, 100% { transform: translateY(0) rotateY(0deg); }
            50% { transform: translateY(-15px) rotateY(5deg); }
          }
        `}</style>
      </section>

      <section className="py-24" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(217, 119, 6, 0.05) 50%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">¿Por qué <span className="text-primary-light">compartir</span>?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">El conocimiento es poder, pero solo cuando es accesible</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📚', title: 'Democratizar el Acceso', desc: 'Millones de personas no tienen acceso a bibliotecas. Compartir libros elimina barreras económicas y geográficas.' },
              { icon: '🤝', title: 'Fortalecer Comunidades', desc: 'Cuando compartimos conocimiento, creamos comunidades más fuertes, informadas y capaces de transformar su entorno.' },
              { icon: '⚡', title: 'Acelerar el Aprendizaje', desc: 'Un libro compartido puede inspirar a decenas de personas. El conocimiento se multiplica cuando se distribuye libremente.' }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Apoya este <span className="text-primary-light">proyecto</span></h2>
          <p className="text-xl text-gray-400 mb-8">Tu contribución ayuda a mantener la plataforma operativa.</p>
          <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #23292f 0%, #1a1f25 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
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

      <section className="py-16" style={{ background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.08) 0%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">📚 <span className="text-primary-light">Libros Destacados</span></h2>
            <p className="text-gray-400">Algunos títulos disponibles en nuestra biblioteca</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredTitles.map((title, i) => (
              <div key={i} className="p-4 rounded-xl text-left cursor-pointer hover:bg-white/5 transition" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-xs text-amber-400">📖</span>
                <p className="text-sm text-white mt-1 line-clamp-2">{title}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={onExplore} className="px-8 py-3 rounded-xl font-bold bg-primary hover:bg-primary-dark transition">
              Ver todos los {bookCount || 160}+ libros →
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2024 OpenBookDrive. Código abierto.</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="/terminos" className="hover:text-amber-400 transition">Términos</a>
            <a href="/privacidad" className="hover:text-amber-400 transition">Privacidad</a>
            <a href="https://github.com/oscaromargp/openbookdrive/releases" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">Changelog</a>
          </div>
        </div>
      </footer>
    </div>
  )
}