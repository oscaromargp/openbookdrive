import { useState, useEffect } from 'react'
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

  const featuredBook = books[0] || null
  const genres = Object.keys(booksByGenre)
  const allGenres = [...genres, 'Solicitudes']

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
          <a href="/" className="flex items-center gap-2">
            <span className="text-red-600 font-black text-2xl tracking-tight">Open</span>
            <span className="text-white font-black text-2xl tracking-tight">BookDrive</span>
          </a>
        </div>

        <div className="hidden md:block flex-1 max-w-md mx-8">
          {showSearch && (
            <SearchBar onSelect={handleSearchSelect} onClose={() => setShowSearch(false)} />
          )}
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
                onClick={logout}
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
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-left text-sm font-mono text-green-400 max-w-md w-full mt-2">
            <p className="text-gray-500 mb-2"># En tu archivo .env:</p>
            <p>VITE_GOOGLE_API_KEY=tu_key</p>
            <p>VITE_GOOGLE_CLIENT_ID=tu_client_id</p>
            <p>VITE_DRIVE_FOLDER_ID=1iSvuUS...</p>
          </div>
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
                  genres.map(genre => (
                    <BookRow
                      key={genre}
                      genre={genre}
                      books={booksByGenre[genre]}
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