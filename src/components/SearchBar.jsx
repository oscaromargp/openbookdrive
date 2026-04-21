import { useState, useRef, useEffect } from 'react'
import { useOpenLibrary } from '../hooks/useOpenLibrary'

export default function SearchBar({ onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { searchBooks } = useOpenLibrary()
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const search = async () => {
      if (query.length < 3) {
        setResults([])
        return
      }

      setLoading(true)
      const books = await searchBooks(query, 8)
      setResults(books)
      setLoading(false)
      setShowResults(true)
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query, searchBooks])

  const handleSelect = (book) => {
    onSelect(book)
    setQuery('')
    setShowResults(false)
    onClose && onClose()
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar libros..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f1a] border border-white/10 rounded-lg overflow-hidden shadow-2xl z-50 max-h-96 overflow-y-auto">
          {results.map((book, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(book)}
              className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors"
            >
              <img
                src={book.coverSmall || book.cover}
                alt={book.title}
                className="w-12 h-16 object-cover rounded"
                onError={e => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=1a1a1a&color=fff&size=100`
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{book.title}</h4>
                <p className="text-gray-500 text-sm truncate">{book.author}</p>
                {book.year && (
                  <p className="text-gray-600 text-xs">{book.year}</p>
                )}
              </div>
              <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded">
                {book.year ? book.year : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      )}

      {showResults && query.length >= 3 && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f1a] border border-white/10 rounded-lg p-4 text-center z-50">
          <p className="text-gray-500">No se encontraron libros</p>
        </div>
      )}
    </div>
  )
}