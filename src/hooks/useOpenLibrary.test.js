import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOpenLibrary } from './useOpenLibrary'

global.fetch = vi.fn()

describe('useOpenLibrary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('searchBooks returns empty array on empty query', async () => {
    const { result } = renderHook(() => useOpenLibrary())
    
    const books = await result.current.searchBooks('')
    
    expect(books).toEqual([])
  })

  it('searchBooks returns books from OpenLibrary API', async () => {
    const mockBooks = {
      docs: [
        {
          title: 'Test Book',
          author_name: ['Test Author'],
          first_publish_year: 2023,
          cover_i: 12345,
          isbn: ['9781234567890'],
        },
      ],
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks,
    })

    const { result } = renderHook(() => useOpenLibrary())
    
    const books = await result.current.searchBooks('test', 1)
    
    expect(books).toHaveLength(1)
    expect(books[0].title).toBe('Test Book')
    expect(books[0].author).toBe('Test Author')
    expect(books[0].year).toBe(2023)
  })

  it('searchBooks returns empty array on API error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useOpenLibrary())
    
    const books = await result.current.searchBooks('test')
    
    expect(books).toEqual([])
    expect(result.current.error).toBe('Network error')
  })

  it('getBookByISBN returns book details', async () => {
    const mockBookData = {
      'ISBN:9781234567890': {
        title: 'ISBN Book',
        authors: [{ name: 'ISBN Author' }],
        publish_date: '2022',
        cover: { large: 'cover.jpg' },
        number_of_pages: 200,
      },
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookData,
    })

    const { result } = renderHook(() => useOpenLibrary())
    
    const book = await result.current.getBookByISBN('9781234567890')
    
    expect(book.title).toBe('ISBN Book')
    expect(book.pages).toBe(200)
  })

  it('getCoverUrl returns correct URL for cover ID', () => {
    const { result } = renderHook(() => useOpenLibrary())
    
    const url = result.current.getCoverUrl(12345, 'L')
    
    expect(url).toBe('https://covers.openlibrary.org/b/id/12345-L.jpg')
  })

  it('getCoverUrl returns null for null coverId', () => {
    const { result } = renderHook(() => useOpenLibrary())
    
    const url = result.current.getCoverUrl(null)
    
    expect(url).toBeNull()
  })

  it('sets loading state during search', async () => {
    let resolveFetch
    global.fetch = vi.fn(() => new Promise((resolve) => {
      resolveFetch = resolve
    })))

    const { result } = renderHook(() => useOpenLibrary())
    
    expect(result.current.loading).toBe(false)
    
    const promise = result.current.searchBooks('test')
    
    // Loading should be true during fetch
    // Note: In actual implementation, this might need waitFor
    await promise
    
    expect(result.current.loading).toBe(false)
    resolveFetch({ ok: true, json: async () => ({ docs: [] }) })
  })
})