export default function Hero({ book, onOpen }) {
  if (!book) return null

  return (
    <div className="relative w-full h-[70vh] min-h-[400px] overflow-hidden">
      {/* Background blur */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
        style={{ backgroundImage: `url(${book.thumbnail})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-16">
        <div className="max-w-xl">
          <div className="text-xs uppercase tracking-widest text-red-500 font-semibold mb-3">
            Libro Destacado
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {book.name}
          </h1>
          <p className="text-gray-400 text-sm mb-2">{book.genre}</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onOpen(book)}
              className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition flex items-center gap-2"
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
              className="bg-gray-700/80 text-white px-6 py-3 rounded font-semibold hover:bg-gray-600 transition flex items-center gap-2"
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
