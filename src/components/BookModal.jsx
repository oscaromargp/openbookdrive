import { useState, useEffect } from 'react'
import { useOpenLibrary } from '../hooks/useOpenLibrary'

export default function BookModal({ book, onClose, onDownload }) {
  const [bookDetails, setBookDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const { getBookDetails } = useOpenLibrary()

  useEffect(() => {
    if (!book) return

    async function fetchDetails() {
      if (book.openLibraryKey) {
        setLoading(true)
        try {
          const details = await getBookDetails(book.openLibraryKey)
          setBookDetails(details)
        } catch (err) {
          console.error('Error fetching book details:', err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchDetails()
  }, [book, getBookDetails])

  useEffect(() => {
    const handleKey = (e) => { 
      if (e.key === 'Escape') onClose() 
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!book) return null

  const title = book.title || book.name || 'Sin título'
  const author = book.author || 'Autor desconocido'
  const year = book.year
  const cover = book.cover || book.thumbnail
  const description = book.description || bookDetails?.description || book.subjects?.[0]
  const subjects = book.subjects || bookDetails?.subjects || []
  const publisher = book.publisher || book.publishers?.[0]
  const pages = book.pages

  const handleImageError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1a1a2e&color=fff&size=400&bold=true`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0f0f1a] rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/10 my-4"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white text-3xl bg-black/50 rounded-full hover:bg-black/70 transition"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 lg:w-80 flex-shrink-0 bg-black relative">
            <div className="aspect-[2/3] w-full h-full">
              <img
                src={cover}
                alt={title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 text-xs font-semibold rounded bg-red-900/40 text-red-400 border border-red-800/30">
                {book.genre || 'General'}
              </span>
              {year && (
                <span className="text-gray-500 text-sm">{year}</span>
              )}
              {pages && (
                <span className="text-gray-500 text-sm">• {pages} páginas</span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              {title}
            </h2>

            <p className="text-lg text-gray-300 mb-2">
              {author}
            </p>

            {publisher && (
              <p className="text-sm text-gray-500 mb-4">
                Editorial: {publisher}
              </p>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                Cargando información...
              </div>
            )}

            {description && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">
                  {description}
                </p>
              </div>
            )}

            {subjects.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {subjects.slice(0, 6).map((subject, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              {book.viewUrl && (
                <a
                  href={book.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                  onClick={() => onDownload && onDownload(book)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Leer en línea
                </a>
              )}
              {book.downloadUrl && (
                <a
                  href={book.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  onClick={() => onDownload && onDownload(book)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}