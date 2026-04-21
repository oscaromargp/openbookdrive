import { useState } from 'react'
import { useGoogleDrive } from './hooks/useGoogleDrive'
import Hero from './components/Hero'
import BookRow from './components/BookRow'
import BookModal from './components/BookModal'
import UploadButton from './components/UploadButton'

export default function App() {
  const { books, booksByGenre, loading, error, isDemo } = useGoogleDrive()
  const [selectedBook, setSelectedBook] = useState(null)

  const featuredBook = books[0] || null
  const genres = Object.keys(booksByGenre)

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 px-8 md:px-16 py-4 flex items-center justify-between bg-gradient-to-b from-dark to-transparent">
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-black text-2xl tracking-tight">Open</span>
          <span className="text-white font-black text-2xl tracking-tight">BookDrive</span>
        </div>
        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-full">
              Modo Demo
            </span>
          )}
          <span className="text-gray-400 text-sm hidden md:block">
            {books.length} libros disponibles
          </span>
        </div>
      </nav>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Cargando biblioteca...</p>
        </div>
      )}

      {/* Error */}
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

      {/* Main content */}
      {!loading && !error && (
        <>
          <Hero book={featuredBook} onOpen={setSelectedBook} />
          <div className="py-8">
            {genres.length === 0 ? (
              <div className="text-center text-gray-500 py-20">
                <p className="text-lg">No se encontraron libros en la carpeta.</p>
                <p className="text-sm mt-2">Asegúrate de que la carpeta sea pública y tenga archivos.</p>
              </div>
            ) : (
              genres.map(genre => (
                <BookRow
                  key={genre}
                  genre={genre}
                  books={booksByGenre[genre]}
                  onBookClick={setSelectedBook}
                />
              ))
            )}
          </div>
        </>
      )}

      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      <UploadButton />
    </div>
  )
}
