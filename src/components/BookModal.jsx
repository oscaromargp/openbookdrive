import { useState, useEffect } from 'react'
import { useOpenLibrary } from '../hooks/useOpenLibrary'

export default function BookModal({ book, onClose, onDownload }) {
  const [bookDetails, setBookDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showReader, setShowReader] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [iframeLoading, setIframeLoading] = useState(true)
  const { getBookDetails, searchBooks } = useOpenLibrary()

  useEffect(() => {
    if (!book) return

    async function fetchDetails() {
      setLoading(true)
      try {
        if (book.openLibraryKey) {
          const details = await getBookDetails(book.openLibraryKey)
          setBookDetails(details)
        } else if (book.title || book.name) {
          const searchQuery = book.title || book.name
          const results = await searchBooks(searchQuery, 1)
          if (results && results.length > 0) {
            const firstResult = results[0]
            setBookDetails({
              title: firstResult.title,
              author: firstResult.author,
              year: firstResult.year,
              cover: firstResult.cover,
              description: firstResult.subjects?.[0] || null,
              subjects: firstResult.subjects || [],
              publisher: firstResult.publisher,
              pages: firstResult.pages,
              openLibraryKey: firstResult.openLibraryKey,
            })
            if (firstResult.openLibraryKey) {
              const fullDetails = await getBookDetails(firstResult.openLibraryKey)
              if (fullDetails) {
                setBookDetails(prev => ({
                  ...prev,
                  description: fullDetails.description || prev.description,
                  subjects: fullDetails.subjects?.length > 0 ? fullDetails.subjects : prev.subjects,
                }))
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching book details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [book, getBookDetails, searchBooks])

  useEffect(() => {
    const handleKey = (e) => { 
      if (e.key === 'Escape') {
        if (showReader) setShowReader(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, showReader])

  useEffect(() => {
    setIframeError(false)
    setIframeLoading(true)
  }, [book?.viewUrl])

  if (!book) return null

  const title = book.title || book.name || 'Sin título'
  const author = book.author || bookDetails?.author || 'Autor desconocido'
  const year = book.year || bookDetails?.year
  const cover = book.cover || bookDetails?.cover || book.thumbnail
  const description = book.description || bookDetails?.description || book.subjects?.[0]
  const subjects = book.subjects || bookDetails?.subjects || []
  const publisher = book.publisher || bookDetails?.publisher || book.publishers?.[0]
  const pages = book.pages || bookDetails?.pages
  const fileSize = book.size ? formatFileSize(book.size) : null

  const formatFileSize = (bytes) => {
    if (!bytes) return null
    const mb = bytes / (1024 * 1024)
    return mb < 1 
      ? `${Math.round(bytes / 1024)} KB` 
      : `${mb.toFixed(1)} MB`
  }

  const handleImageError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1a1a2e&color=fff&size=400&bold=true`
  }

  if (showReader && book.viewUrl) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-dark"
        style={{ paddingTop: '60px' }}
      >
        <div className="absolute top-0 left-0 right-0 h-16 bg-dark/95 backdrop-blur-md flex items-center justify-between px-6 border-b border-white/10 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowReader(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Volver</span>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <h3 className="text-white font-medium truncate max-w-md">{title}</h3>
          </div>
          <div className="flex items-center gap-3">
            {book.downloadUrl && (
              <a
                href={book.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition"
                onClick={() => onDownload && onDownload(book)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar
              </a>
            )}
            <button
              onClick={() => setShowReader(false)}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {iframeLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando visor...</p>
            </div>
          </div>
        )}
        
        {iframeError ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No se puede mostrar el libro</h3>
              <p className="text-gray-400 mb-4">El visor de Google Drive no está disponible para este archivo.</p>
              {book.downloadUrl && (
                <a
                  href={book.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar libro
                </a>
              )}
            </div>
          </div>
        ) : (
          <iframe
            src={book.viewUrl}
            className="w-full flex-1"
            title={`Leer ${title}`}
            allow="autoplay"
            onLoad={() => setIframeLoading(false)}
            onError={() => { setIframeLoading(false); setIframeError(true); }}
          />
        )}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl overflow-hidden max-w-6xl w-full h-[85vh] shadow-2xl border border-white/10 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white truncate">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white text-2xl hover:bg-white/10 rounded-full transition"
          >
            ×
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 lg:w-80 flex-shrink-0 bg-black relative">
            <div className="aspect-[2/3] w-full h-full">
              <img
                src={bookDetails?.cover || cover}
                alt={title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 text-xs font-semibold rounded bg-amber-900/40 text-amber-400 border border-amber-800/30">
                {book.genre || 'General'}
              </span>
              {year && (
                <span className="text-gray-500 text-sm">{year}</span>
              )}
              {pages && (
                <span className="text-gray-500 text-sm">• {pages} páginas</span>
              )}
              {fileSize && (
                <span className="text-gray-500 text-sm">• {fileSize}</span>
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
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                Cargando información...
              </div>
            )}

            {description && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm leading-relaxed">
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
                <button
                  onClick={() => setShowReader(true)}
                  className="flex-1 bg-amber-500 text-black py-3 rounded-lg font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Leer ahora
                </button>
              )}
              {book.downloadUrl && (
                <a
                  href={book.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
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