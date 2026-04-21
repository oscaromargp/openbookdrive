import { useState } from 'react'

const OPENLIBRARY_API = 'https://openlibrary.org'

export function useOpenLibrary() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchBooks = async (query, limit = 10) => {
    setLoading(true)
    setError(null)
    try {
      const encodedQuery = encodeURIComponent(query)
      const response = await fetch(
        `${OPENLIBRARY_API}/search.json?q=${encodedQuery}&limit=${limit}&fields=title,author_name,first_publish_year,cover_i,isbn,subject,publisher,number_of_pages_median`
      )
      
      if (!response.ok) {
        throw new Error('Error searching books')
      }

      const data = await response.json()
      
      const books = (data.docs || []).map(book => ({
        title: book.title,
        author: book.author_name?.[0] || 'Autor desconocido',
        year: book.first_publish_year,
        cover: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : null,
        coverMedium: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        coverSmall: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
          : null,
        isbn: book.isbn?.[0],
        subjects: book.subject?.slice(0, 5) || [],
        publisher: book.publisher?.[0],
        pages: book.number_of_pages_median,
        openLibraryKey: book.key,
      }))

      return books
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const getBookByISBN = async (isbn) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${OPENLIBRARY_API}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      )
      
      if (!response.ok) {
        throw new Error('Error fetching book by ISBN')
      }

      const data = await response.json()
      const bookData = data[`ISBN:${isbn}`]
      
      if (!bookData) return null

      return {
        title: bookData.title,
        author: bookData.authors?.[0]?.name || 'Autor desconocido',
        year: bookData.publish_date,
        cover: bookData.cover?.large || bookData.cover?.medium,
        description: bookData.notes?.value || bookData.notes || null,
        subjects: bookData.subjects?.slice(0, 5).map(s => s.name) || [],
        publishers: bookData.publishers?.map(p => p.name) || [],
        pages: bookData.number_of_pages,
        isbn,
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getBookDetails = async (openLibraryKey) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${OPENLIBRARY_API}${openLibraryKey}.json`
      )
      
      if (!response.ok) {
        throw new Error('Error fetching book details')
      }

      const data = await response.json()
      
      return {
        title: data.title,
        description: data.description?.value || data.description || null,
        subjects: data.subjects?.slice(0, 10) || [],
        covers: data.covers,
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getCoverUrl = (coverId, size = 'L') => {
    if (!coverId) return null
    const sizes = { S: 200, M: 400, L: 800, XL: 1200 }
    const sizeParam = sizes[size] || 800
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
  }

  const searchByTitle = async (title, limit = 5) => {
    return searchBooks(title, limit)
  }

  return {
    searchBooks,
    getBookByISBN,
    getBookDetails,
    getCoverUrl,
    searchByTitle,
    loading,
    error,
  }
}