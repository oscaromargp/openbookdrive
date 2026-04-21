import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useOpenLibrary } from '../hooks/useOpenLibrary'

export default function RequestModal({ onClose }) {
  const { user, login } = useAuth()
  const { searchBooks } = useOpenLibrary()
  const [email, setEmail] = useState(user?.email || '')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    const search = async () => {
      if (query.length < 3) {
        setResults([])
        return
      }
      setLoading(true)
      const books = await searchBooks(query, 5)
      setResults(books)
      setLoading(false)
    }
    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query, searchBooks])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email requerido')
      return
    }
    await login(email)
  }

  const handleSubmit = () => {
    if (!selectedBook) {
      setError('Selecciona un libro')
      return
    }

    const requests = JSON.parse(localStorage.getItem('openbookdrive_requests') || '[]')
    const newRequest = {
      id: Date.now(),
      userEmail: user.email,
      title: selectedBook.title,
      author: selectedBook.author,
      year: selectedBook.year,
      cover: selectedBook.cover,
      requestedAt: new Date().toISOString(),
      status: 'pendiente'
    }
    requests.push(newRequest)
    localStorage.setItem('openbookdrive_requests', JSON.stringify(requests))
    setSuccess(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f0f1a] rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Solicitar Libro</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">
              ×
            </button>
          </div>

          {!user ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tu email para identificarte
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Continuar
              </button>
            </form>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
              <p className="text-gray-400 mb-4">
                Has solicitado: <span className="text-white">{selectedBook?.title}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Te avisaremos cuando esté disponible
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                <p className="text-green-400 text-sm">
                  Sesión iniciada como: {user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Buscar libro</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Título o autor..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
                {loading && (
                  <div className="mt-2 flex justify-center">
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {results.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {results.map((book, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedBook(book)
                        setQuery(book.title)
                        setResults([])
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedBook?.title === book.title 
                          ? 'bg-red-600/30 border border-red-500' 
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <img
                        src={book.coverSmall || book.cover}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded"
                        onError={e => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=1a1a1a&color=fff&size=100`
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{book.title}</p>
                        <p className="text-gray-500 text-xs truncate">{book.author}</p>
                      </div>
                      {selectedBook?.title === book.title && (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedBook && (
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white font-medium">{selectedBook.title}</p>
                  <p className="text-gray-500 text-sm">{selectedBook.author}</p>
                  {selectedBook.year && (
                    <p className="text-gray-600 text-xs mt-1">{selectedBook.year}</p>
                  )}
                </div>
              )}

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!selectedBook}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Solicitar libro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}