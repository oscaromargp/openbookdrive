import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function AuthModal({ onClose, onLoginSuccess }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email requerido')
      return
    }
    
    setLoading(true)
    setError(null)
    
    const result = await login(email)
    
    if (result.success) {
      onLoginSuccess(result.user)
      onClose()
    } else {
      setError(result.error || 'Error al iniciar sesión')
    }
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f0f1a] rounded-2xl overflow-hidden max-w-md w-full shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Identificate</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">
              ×
            </button>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Ingresa tu email para identificarte al subir o solicitar libros.
            No necesitas contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Continuar
                </>
              )}
            </button>
          </form>

          <p className="text-gray-600 text-xs text-center mt-4">
            Al continuar, aceptas que usaremos tu email para identificarte.
          </p>
        </div>
      </div>
    </div>
  )
}