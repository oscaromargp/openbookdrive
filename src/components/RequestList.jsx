import { useState, useEffect } from 'react'

export default function RequestList({ onClose }) {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('openbookdrive_requests') || '[]')
    setRequests(stored.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)))
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const getRequestCount = (title) => {
    return requests.filter(r => r.title.toLowerCase() === title.toLowerCase()).length
  }

  const uniqueRequests = requests.reduce((acc, req) => {
    const existing = acc.find(r => r.title.toLowerCase() === req.title.toLowerCase())
    if (existing) {
      existing.count = (existing.count || 1) + 1
      existing.users.push(req.userEmail)
    } else {
      acc.push({ ...req, count: 1, users: [req.userEmail] })
    }
    return acc
  }, [])

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
            <div>
              <h2 className="text-xl font-bold text-white">Libros Solicitados</h2>
              <p className="text-gray-500 text-sm">
                {uniqueRequests.length} libro{uniqueRequests.length !== 1 ? 's' : ''} pendiente{uniqueRequests.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">
              ×
            </button>
          </div>

          {uniqueRequests.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-500">No hay solicitudes aún</p>
              <p className="text-gray-600 text-sm mt-1">Sé el primero en solicitar un libro</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uniqueRequests.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <img
                    src={req.cover || req.coverSmall}
                    alt={req.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(req.title)}&background=1a1a1a&color=fff&size=100`
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{req.title}</p>
                    <p className="text-gray-500 text-sm truncate">{req.author}</p>
                    <p className="text-gray-600 text-xs">
                      {req.count} solicitud{req.count !== 1 ? 'es' : ''} • {new Date(req.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-400 rounded">
                      {req.status || 'pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}