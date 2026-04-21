export default function BookCard({ book, onClick }) {
  const cover = book.cover || book.thumbnail
  
  return (
    <div
      onClick={() => onClick(book)}
      className="relative flex-shrink-0 w-36 md:w-40 cursor-pointer group"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-card transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/60 group-hover:-translate-y-1">
        <img
          src={cover}
          alt={book.title || book.name}
          className="w-full h-full object-cover"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title || book.name)}&background=1a1a1a&color=fff&size=200&bold=true`
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          {book.author && (
            <p className="text-xs text-gray-300 truncate mb-1">{book.author}</p>
          )}
          {book.year && (
            <p className="text-xs text-gray-500">{book.year}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/50 text-red-300">
              {book.genre || 'General'}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-red-400 transition-colors">
          {book.title || book.name}
        </h3>
        {book.author && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {book.author}
          </p>
        )}
      </div>
    </div>
  )
}