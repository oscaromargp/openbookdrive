import { useState, useEffect } from 'react'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID

export default function UploadButton() {
  const [pickerLoaded, setPickerLoaded] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (window.gapi) { setPickerLoaded(true); return }
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      window.gapi.load('picker', () => setPickerLoaded(true))
    }
    document.body.appendChild(script)
  }, [])

  const openPicker = () => {
    if (!CLIENT_ID || CLIENT_ID === 'TU_CLIENT_ID_AQUI') {
      setStatus('Configura VITE_GOOGLE_CLIENT_ID en .env para activar la subida')
      setTimeout(() => setStatus(null), 4000)
      return
    }

    const tokenClient = window.google?.accounts?.oauth2?.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (tokenResponse) => {
        if (tokenResponse.error) return
        const picker = new window.google.picker.PickerBuilder()
          .addView(new window.google.picker.DocsUploadView().setParent(FOLDER_ID))
          .setOAuthToken(tokenResponse.access_token)
          .setDeveloperKey(API_KEY)
          .setCallback((data) => {
            if (data.action === window.google.picker.Action.PICKED) {
              setStatus('¡Libro subido exitosamente! Recarga para verlo.')
              setTimeout(() => setStatus(null), 5000)
            }
          })
          .build()
        picker.setVisible(true)
      },
    })
    tokenClient?.requestAccessToken({ prompt: 'consent' })
  }

  return (
    <>
      <button
        onClick={openPicker}
        disabled={!pickerLoaded}
        title="Subir libro a la biblioteca"
        className="fixed bottom-8 right-8 z-40 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {status && (
        <div className="fixed bottom-28 right-8 z-40 bg-gray-900 border border-gray-700 text-white text-sm px-4 py-3 rounded-xl shadow-lg max-w-xs">
          {status}
        </div>
      )}
    </>
  )
}
