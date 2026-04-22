import { useState, useEffect } from 'react'
import { useOpenLibrary } from '../hooks/useOpenLibrary'

export default function BookModal({ book, onClose, onDownload }) {
  const [bookDetails, setBookDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const { getBookDetails, searchBooks } = useOpenLibrary()

  useEffect(() => {
    if (!book) return

    async function fetchDetails() {
      try {
        if (book.openLibraryKey) {
          const details = await getBookDetails(book.openLibraryKey)
          setBookDetails(details)
        } else if (book.title || book.name) {
          const results = await searchBooks(book.title || book.name, 1)
          if (results?.length > 0) {
            const r = results[0]
            setBookDetails({
              title: r.title,
              author: r.author,
              year: r.year,
              cover: r.cover,
              description: r.subjects?.[0] || r.description || null,
              subjects: r.subjects || [],
              pages: r.pages,
              publisher: r.publisher,
            })
          }
        }
      } catch (err) {
        console.error('Error fetching:', err)
      } finally {
        setLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [book, getBookDetails, searchBooks])

  useEffect(() => {
    const handleKey = (e) => { 
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!book) return null

  const title = book.title || book.name || 'Sin título'
  const author = book.author || bookDetails?.author || 'Autor desconocido'
  const year = book.year || bookDetails?.year
  const cover = book.cover || bookDetails?.cover || book.thumbnail
  const description = book.description || bookDetails?.description
  const subjects = book.subjects || bookDetails?.subjects || []
  const publisher = book.publisher || bookDetails?.publisher
  const pages = book.pages || bookDetails?.pages
  const size = book.size
  const genre = book.genre

  const formatSize = (bytes) => {
    if (!bytes) return null
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`
  }

  const handleImageError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1a1a2e&color=fff&size=400&bold=true`
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="max-w-5xl mx-auto p-4 md:p-8" onClick={e => e.stopPropagation()}>
        {/* Cover and Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Cover */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
              <img src={cover} alt={title} className="w-full h-full object-cover" onError={handleImageError} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-xl text-gray-400 mb-4">{author}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {genre && (
                <span className="px-3 py-1 text-sm rounded-full bg-amber-600/20 text-amber-400 border border-amber-600/30">
                  {genre}
                </span>
              )}
              {year && <span className="text-gray-500">{year}</span>}
              {pages && <span className="text-gray-500">{pages} páginas</span>}
              {size && <span className="text-gray-500">{formatSize(size)}</span>}
            </div>

            {/* Botones centrados */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {book.viewUrl && (
                <a
                  href={book.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-500 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  👁️ Leer en línea
                </a>
              )}

              {book.downloadUrl && (
                <a
                  href={book.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar PDF
                </a>
              )}
            </div>

            {/* Descripción */}
            {description && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Descripción
                </h3>
                <p className="text-gray-300 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Temas */}
            {subjects.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Temas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subjects.slice(0, 8).map((s, i) => (
                    <span key={i} className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Editorial */}
            {publisher && (
              <div className="mt-4 text-sm text-gray-500">
                <span className="font-medium">Editorial:</span> {publisher}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}