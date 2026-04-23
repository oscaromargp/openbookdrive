import { useState, useEffect, useMemo } from 'react'

const FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

const GENRE_KEYWORDS = {
  'Ficción': ['ficcion', 'fiction', 'novela', 'novel', 'fantasia', 'fantasy', 'sci-fi', 'ciencia ficcion'],
  'Ingeniería': ['ingenieria', 'engineering', 'programacion', 'programming', 'software', 'codigo', 'code', 'algoritmo', 'database', 'web', 'react', 'python', 'javascript'],
  'Autocuidado': ['autocuidado', 'self-help', 'mindfulness', 'bienestar', 'salud', 'meditacion', 'habitos', 'habits', 'motivacion', 'psicologia'],
  'Historia': ['historia', 'history', 'historico', 'historical', 'biografia', 'biography'],
  'Ciencias': ['ciencia', 'science', 'matematicas', 'physics', 'quimica', 'biologia', 'biology'],
  'Negocios': ['negocios', 'business', 'emprendimiento', 'startup', 'marketing', 'finanzas', 'finance', 'economia'],
  'Arte & Diseño': ['arte', 'art', 'diseño', 'design', 'fotografia', 'photography', 'pintura', 'musica'],
}

const genreKeywordsMap = useMemo(() => {
  const map = {}
  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
    for (const kw of keywords) {
      map[kw] = genre
    }
  }
  return map
}, [])

function detectGenre(filename) {
  const lower = filename.toLowerCase()
  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return genre
  }
  return 'General'
}

const DEMO_BOOKS = [
  { id: 'd1', name: 'El Señor de los Anillos', genre: 'Ficción', thumbnail: 'https://covers.openlibrary.org/b/id/8743161-L.jpg' },
  { id: 'd2', name: 'Dune', genre: 'Ficción', thumbnail: 'https://covers.openlibrary.org/b/id/10167657-L.jpg' },
  { id: 'd3', name: 'Fundación', genre: 'Ficción', thumbnail: 'https://covers.openlibrary.org/b/id/12801393-L.jpg' },
  { id: 'd4', name: 'Clean Code', genre: 'Ingeniería', thumbnail: 'https://covers.openlibrary.org/b/id/8490659-L.jpg' },
  { id: 'd5', name: 'The Pragmatic Programmer', genre: 'Ingeniería', thumbnail: 'https://covers.openlibrary.org/b/id/8816562-L.jpg' },
  { id: 'd6', name: 'Designing Data-Intensive Applications', genre: 'Ingeniería', thumbnail: 'https://covers.openlibrary.org/b/id/10556628-L.jpg' },
  { id: 'd7', name: 'Hábitos Atómicos', genre: 'Autocuidado', thumbnail: 'https://covers.openlibrary.org/b/id/12377528-L.jpg' },
  { id: 'd8', name: 'El Poder del Ahora', genre: 'Autocuidado', thumbnail: 'https://covers.openlibrary.org/b/id/9279882-L.jpg' },
  { id: 'd9', name: 'Sapiens', genre: 'Historia', thumbnail: 'https://covers.openlibrary.org/b/id/9277626-L.jpg' },
  { id: 'd10', name: 'Una Breve Historia del Tiempo', genre: 'Ciencias', thumbnail: 'https://covers.openlibrary.org/b/id/12192277-L.jpg' },
  { id: 'd11', name: 'De Cero a Uno', genre: 'Negocios', thumbnail: 'https://covers.openlibrary.org/b/id/9257242-L.jpg' },
  { id: 'd12', name: 'El Arte de la Guerra', genre: 'Negocios', thumbnail: 'https://covers.openlibrary.org/b/id/8227082-L.jpg' },
].map(b => ({
  ...b,
  rawName: b.name + '.pdf',
  mimeType: 'application/pdf',
  viewUrl: `https://drive.google.com/file/d/${b.id}/preview`,
  downloadUrl: `https://drive.google.com/uc?export=download&id=${b.id}`,
  size: null,
  isDemo: true,
}))

function detectGenre(filename) {
  const lower = filename.toLowerCase()
  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return genre
  }
  return 'General'
}

function buildThumbnailUrl(fileId) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`
}

export function useGoogleDrive() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
      setBooks(DEMO_BOOKS)
      setIsDemo(true)
      setLoading(false)
      return
    }

    async function fetchBooks() {
      try {
        const query = encodeURIComponent(`'${FOLDER_ID}' in parents and trashed=false`)
        const fields = encodeURIComponent('files(id,name,mimeType,thumbnailLink,webViewLink,webContentLink,size,createdTime)')
        const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}&fields=${fields}&pageSize=500`

        const res = await fetch(url)
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error?.message || 'Error al conectar con Google Drive')
        }

        const data = await res.json()
        const parsed = (data.files || []).map(file => ({
          id: file.id,
          name: file.name.replace(/\.(pdf|epub|mobi|docx?)$/i, ''),
          rawName: file.name,
          mimeType: file.mimeType,
          thumbnail: file.thumbnailLink || buildThumbnailUrl(file.id),
          viewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
          size: file.size,
          createdTime: file.createdTime,
          genre: detectGenre(file.name),
          isDemo: false,
        }))

        if (parsed.length === 0) {
          setBooks(DEMO_BOOKS)
          setIsDemo(true)
        } else {
          setBooks(parsed)
        }
      } catch (err) {
        setBooks(DEMO_BOOKS)
        setIsDemo(true)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const booksByGenre = books.reduce((acc, book) => {
    if (!acc[book.genre]) acc[book.genre] = []
    acc[book.genre].push(book)
    return acc
  }, {})

  return { books, booksByGenre, loading, error, isDemo }
}
