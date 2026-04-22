import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

const ALL_GENRES = [
  'Ficción', 'Ingeniería', 'Autocuidado', 'Historia', 
  'Ciencias', 'Negocios', 'Arte & Diseño', 'General'
]

export default function ProfileModal({ onClose }) {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState('')
  const [favoriteGenres, setFavoriteGenres] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user?.profile) {
      setName(user.profile.name || '')
      setFavoriteGenres(user.profile.favoriteGenres || [])
    }
  }, [user])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const toggleGenre = (genre) => {
    setFavoriteGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleSave = () => {
    updateProfile({
      name,
      favoriteGenres,
      updatedAt: new Date().toISOString()
    })
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1000)
  }

  if (!user) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <div
          className="bg-card rounded-2xl p-6 max-w-sm w-full text-center border border-white/10"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold text-white mb-2">Perfil</h3>
          <p className="text-gray-400 mb-4">Inicia sesión para configurar tu perfil</p>
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Tu Perfil</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nombre (opcional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamas?"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">
               Géneros favoritos
                <span className="text-gray-500 ml-2">
                  ({favoriteGenres.length} seleccionados)
                </span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Selecciona los géneros que te interesan para ver recomendaciones personalizadas
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      favoriteGenres.includes(genre)
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {favoriteGenres.includes(genre) && (
                      <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-white text-sm font-medium">Datos guardados localmente</span>
              </div>
              <p className="text-gray-500 text-xs">
                Tu perfil se guarda en tu navegador. No compartimos tus datos.
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saved}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  ¡Guardado!
                </>
              ) : (
                'Guardar perfil'
              )}
            </button>
          </div>
        </div>

        {user && (
          <div className="px-6 py-4 bg-white/5 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Sesión activa</span>
              <span className="text-gray-400 text-sm">{user.email}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}