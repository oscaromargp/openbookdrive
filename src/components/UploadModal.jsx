import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useOpenLibrary } from '../hooks/useOpenLibrary'

const DRIVE_UPLOAD_URL = import.meta.env.VITE_DRIVE_UPLOAD_URL || 'https://drive.google.com/drive/folders/'

export default function UploadModal({ onClose }) {
  const { user, login } = useAuth()
  const { searchBooks } = useOpenLibrary()
  const [email, setEmail] = useState(user?.email || '')
  const [file, setFile] = useState(null)
  const [genre, setGenre] = useState('')
  const [autoDetect, setAutoDetect] = useState(true)
  const [detectedInfo, setDetectedInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const genres = [
    'Ficción', 'Ingeniería', 'Autocuidado', 'Historia', 
    'Ciencias', 'Negocios', 'Arte & Diseño', 'General'
  ]

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    if (file && autoDetect) {
      const filename = file.name.replace(/\.(pdf|epub|mobi|docx?)$/i, '')
      detectBookInfo(filename)
    }
  }, [file, autoDetect])

  const detectBookInfo = async (filename) => {
    setLoading(true)
    try {
      const results = await searchBooks(filename, 1)
      if (results.length > 0) {
        const book = results[0]
        setDetectedInfo({
          title: book.title,
          author: book.author,
          year: book.year,
          cover: book.cover,
          genre: detectGenre(book.subjects)
        })
      }
    } catch (err) {
      console.error('Error detecting book info:', err)
    } finally {
      setLoading(false)
    }
  }

  const detectGenre = (subjects) => {
    if (!subjects) return 'General'
    const genreMap = {
      'Ficción': ['fiction', 'novel', 'fantasy', 'sci-fi', 'romance', 'mystery'],
      'Ingeniería': ['programming', 'software', 'engineering', 'code', 'computer', 'technology'],
      'Autocuidado': ['self-help', 'motivation', 'mindfulness', 'psychology', 'health'],
      'Historia': ['history', 'historical', 'biography', 'war'],
      'Ciencias': ['science', 'math', 'physics', 'biology', 'chemistry'],
      'Negocios': ['business', 'entrepreneurship', 'marketing', 'finance', 'economics'],
      'Arte & Diseño': ['art', 'design', 'photography', 'music', 'architecture'],
    }
    for (const [g, keywords] of Object.entries(genreMap)) {
      if (subjects.some(s => keywords.some(k => s.toLowerCase().includes(k)))) {
        return g
      }
    }
    return 'General'
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
    if (!file) {
      setError('Selecciona un archivo')
      return
    }
    if (!genre) {
      setError('Selecciona un género')
      return
    }
    
    setError(null)
    setUploading(true)

    const requestData = {
      email,
      filename: file.name,
      title: detectedInfo?.title || file.name.replace(/\.(pdf|epub|mobi|docx?)$/i, ''),
      author: detectedInfo?.author || 'No especificado',
      genre,
      detectedAt: new Date().toISOString()
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
        className="bg-card rounded-2xl overflow-hidden max-w-md w-full shadow-2xl border border-white/10"
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
                  Tu email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
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
              <h3 className="text-xl font-bold text-white mb-2">¡Listo!</h3>
              <p className="text-gray-400 mb-4">
                Serás redirigido a Google Drive
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
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-400 text-sm">
                  Conectado: {user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Archivo</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-amber-500 transition-colors relative">
                  <input
                    type="file"
                    accept=".pdf,.epub,.mobi"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="text-left">
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-400">Arrastra o haz clic</p>
                      <p className="text-gray-600 text-xs mt-1">PDF, EPUB hasta 100MB</p>
                    </>
                  )}
                </div>
              </div>

              {detectedInfo && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-amber-400 text-sm mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span className="font-medium">Información detectada</span>
                  </div>
                  <p className="text-white text-sm">{detectedInfo.title}</p>
                  <p className="text-gray-500 text-xs">{detectedInfo.author} • {detectedInfo.year}</p>
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  Detectando información del libro...
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-2">Género</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="" className="text-black">Seleccionar</option>
                  {genres.map(g => (
                    <option key={g} value={g} className="text-black">{g}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoDetect} 
                  onChange={(e) => setAutoDetect(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-amber-500"
                />
                Auto-detectar título y autor
              </label>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading || !file || !genre}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Continuar a Google Drive
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