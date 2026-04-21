import { useEffect } from 'react'

export default function BookModal({ book, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!book) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-xl overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Cover sidebar */}
        <div className="md:w-48 flex-shrink-0 bg-black">
          <img
            src={book.thumbnail}
            alt={book.name}
            className="w-full h-64 md:h-full object-cover"
            onError={e => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.name)}&background=111&color=fff&size=200&bold=true`
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight">{book.name}</h2>
                <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded bg-red-900/40 text-red-400 border border-red-800/30">
                  {book.genre}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white text-2xl leading-none ml-4 flex-shrink-0"
              >
                ×
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-1">{book.rawName}</p>
            {book.size && (
              <p className="text-gray-600 text-xs">
                {(book.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <a
              href={book.viewUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Leer en línea
            </a>
            <a
              href={book.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
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
  )
}
