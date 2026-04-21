import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useOpenLibrary } from '../hooks/useOpenLibrary'

const DRIVE_UPLOAD_URL = import.meta.env.VITE_DRIVE_UPLOAD_URL || 'https://drive.google.com/drive/folders/'

export default function UploadModal({ onClose }) {
  const { user, login } = useAuth()
  const { searchByTitle } = useOpenLibrary()
  const [email, setEmail] = useState(user?.email || '')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [bookInfo, setBookInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const genres = [
    'Ficción', 'Ingeniería', 'Autocuidado', 'Historia', 
    'Ciencias', 'Negocios', 'Arte & Diseño', 'Otro'
  ]

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSearchBook = async () => {
    if (!title) return
    setLoading(true)
    const results = await searchByTitle(title, 1)
    if (results.length > 0) {
      setBookInfo(results[0])
      if (!author) setAuthor(results[0].author)
      if (!genre) setGenre(detectGenre(results[0].subjects))
    }
    setLoading(false)
  }

  const detectGenre = (subjects) => {
    if (!subjects) return 'Otro'
    const genreMap = {
      'Ficción': ['fiction', 'novel', 'fantasy', 'sci-fi'],
      'Ingeniería': ['programming', 'software', 'engineering', 'code'],
      'Autocuidado': ['self-help', 'motivation', 'mindfulness'],
      'Historia': ['history', 'historical', 'biography'],
      'Ciencias': ['science', 'math', 'physics'],
      'Negocios': ['business', 'entrepreneurship', 'marketing'],
    }
    for (const [g, keywords] of Object.entries(genreMap)) {
      if (subjects.some(s => keywords.some(k => s.toLowerCase().includes(k)))) {
        return g
      }
    }
    return 'Otro'
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email requerido')
      return
    }
    await login(email)
  }

  const handleUpload = async () => {
    if (!email) {
      setError('Necesitas iniciar sesión primero')
      return
    }
    if (!title) {
      setError('Título requerido')
      return
    }
    
    setError(null)
    setUploading(true)

    const requestData = {
      email,
      title,
      author: author || 'No especificado',
      genre: genre || 'Otro',
      uploadedAt: new Date().toISOString()
    }

    localStorage.setItem('openbookdrive_upload_pending', JSON.stringify(requestData))

    setSuccess(true)
    setUploading(false)

    setTimeout(() => {
      window.open(DRIVE_UPLOAD_URL, '_blank')
    }, 1500)
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
            <h2 className="text-xl font-bold text-white">Subir Libro</h2>
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
                Serás redirigido a Google Drive para subir el archivo
              </p>
              <a
                href={DRIVE_UPLOAD_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-white text-black px-6 py-2 rounded-lg font-medium"
              >
                Ir a Google Drive
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                <p className="text-green-400 text-sm">
                  Sesión iniciada como: {user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Buscar libro (opcional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título del libro"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleSearchBook}
                    disabled={loading || !title}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50"
                  >
                    {loading ? '...' : 'Buscar'}
                  </button>
                </div>
                {bookInfo && (
                  <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {bookInfo.title} - {bookInfo.author}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Título del libro</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Autor</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Autor del libro"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Género</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="" className="text-black">Seleccionar género</option>
                  {genres.map(g => (
                    <option key={g} value={g} className="text-black">{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Archivo (PDF/EPUB)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-red-500 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.epub,.mobi"
                    className="hidden"
                  />
                  <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-400 text-sm">Arrastra o haz clic para seleccionar</p>
                  <p className="text-gray-600 text-xs mt-1">PDF, EPUB hasta 100MB</p>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Solicitar subir libro
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}