import { useRef } from 'react'
import BookCard from './BookCard'

export default function BookRow({ genre, books, onBookClick, loading }) {
  const rowRef = useRef(null)

  const scroll = (dir) => {
    const el = rowRef.current
    if (el) el.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 px-8 md:px-16 text-white">{genre}</h2>
        <div className="flex gap-4 px-8 md:px-16 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-shrink-0 w-36 md:w-40">
              <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
              <div className="mt-3 h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 px-8 md:px-16 text-white">{genre}</h2>
      <div className="relative group/row">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
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

        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}