import { useState, useEffect } from 'react'
import { useOpenLibrary } from '../hooks/useOpenLibrary'

export default function Hero({ book, onOpen }) {
  const [bookInfo, setBookInfo] = useState(null)
  const { searchByTitle, loading: loadingOL } = useOpenLibrary()

  useEffect(() => {
    if (!book) return

    async function fetchBookInfo() {
      const results = await searchByTitle(book.name, 1)
      if (results.length > 0) {
        setBookInfo(results[0])
      }
    }

    if (!book.author && !book.description) {
      fetchBookInfo()
    }
  }, [book, searchByTitle])

  if (!book) return null

  const title = bookInfo?.title || book.name
  const author = book.author || bookInfo?.author || 'Autor desconocido'
  const year = book.year || bookInfo?.year
  const cover = bookInfo?.cover || book.thumbnail
  const description = bookInfo?.subjects?.[0]

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-md"
        style={{ 
          backgroundImage: cover ? `url(${cover})` : 'none',
          backgroundColor: !cover ? '#1a1a2e' : undefined
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

      <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start max-w-5xl">
          <div className="flex-shrink-0">
            <div className="relative w-36 md:w-48 lg:w-56 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <img
                src={cover}
                alt={title}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1a1a2e&color=fff&size=400&bold=true`
                }}
              />
              {year && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <span className="text-white font-semibold text-sm">{year}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="inline-block text-xs uppercase tracking-widest text-red-500 font-semibold mb-3">
              Libro Destacado
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              {title}
            </h1>
            
            <p className="text-lg text-gray-300 mb-2">
              {author}
            </p>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium bg-red-900/40 text-red-400 border border-red-800/30 rounded">
                {book.genre || 'General'}
              </span>
              {bookInfo?.pages && (
                <span className="text-gray-500 text-sm">
                  {bookInfo.pages} páginas
                </span>
              )}
            </div>

            {description && (
              <p className="text-gray-400 text-sm md:text-base mb-6 line-clamp-3 max-w-xl">
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onOpen({ ...book, ...bookInfo, title, author, cover })}
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Leer ahora
              </button>
              <a
                href={book.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition flex items-center gap-2 border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}