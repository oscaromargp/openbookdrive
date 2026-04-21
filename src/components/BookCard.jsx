export default function BookCard({ book, onClick }) {
  return (
    <div
      onClick={() => onClick(book)}
      className="relative flex-shrink-0 w-36 md:w-44 cursor-pointer group"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-card transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/60">
        <img
          src={book.thumbnail}
          alt={book.name}
          className="w-full h-full object-cover"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.name)}&background=1a1a1a&color=fff&size=200&bold=true`
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-xs font-semibold text-white leading-tight">{book.name}</span>
        </div>
      </div>

      {/* Genre badge */}
      <div className="mt-2 px-1">
        <p className="text-xs text-gray-400 truncate">{book.name}</p>
      </div>
    </div>
  )
}
