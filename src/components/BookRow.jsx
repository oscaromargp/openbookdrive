import { useRef } from 'react'
import BookCard from './BookCard'

export default function BookRow({ genre, books, onBookClick }) {
  const rowRef = useRef(null)

  const scroll = (dir) => {
    const el = rowRef.current
    if (el) el.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 px-8 md:px-16 text-white">{genre}</h2>
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity shadow-lg"
        >
          ‹
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 px-8 md:px-16 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map(book => (
            <BookCard key={book.id} book={book} onClick={onBookClick} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity shadow-lg"
        >
          ›
        </button>
      </div>
    </div>
  )
}
