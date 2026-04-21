export default function BookCard({ book, onClick, loading }) {
  const cover = book?.cover || book?.thumbnail
  const fileType = getFileType(book?.rawName || book?.name || '')
  const title = book?.title || book?.name || 'Sin título'
  
  if (loading) {
    return <SkeletonCard />
  }

  const isPlaceholder = !cover || cover.includes('drive.google.com/thumbnail')

  return (
    <div
      onClick={() => onClick && onClick(book)}
      className="relative flex-shrink-0 w-36 md:w-40 cursor-pointer group"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-amber-900/30 group-hover:-translate-y-2">
        {isPlaceholder ? (
          <div className="w-full h-full relative overflow-hidden" style={{
            background: generateGradient(title)
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-16 border-2 border-white/30 rounded flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-white font-medium text-xs leading-tight line-clamp-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                {title}
              </p>
            </div>
            <div className="absolute top-2 right-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white/80 font-medium">
                {fileType}
              </span>
            </div>
          </div>
        ) : (
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover"
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = generatePlaceholderHTML(title, fileType)
            }}
          />
        )}
        
        {!isPlaceholder && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-600/90 text-white font-medium">
              {fileType}
            </span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          {book?.author && (
            <p className="text-xs text-gray-300 truncate mb-1">{book.author}</p>
          )}
          {book?.year && (
            <p className="text-xs text-gray-500">{book.year}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/50 text-amber-300">
              {book?.genre || 'General'}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-7 h-7 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-amber-400 transition-colors">
          {title}
        </h3>
        {book?.author && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {book.author}
          </p>
        )}
      </div>
    </div>
  )
}

function getFileType(filename) {
  const ext = filename?.split('.')?.pop()?.toLowerCase()
  const types = {
    pdf: 'PDF',
    epub: 'EPUB',
    mobi: 'MOBI',
    docx: 'DOCX',
    doc: 'DOC',
  }
  return types[ext] || 'PDF'
}

function generateGradient(title) {
  const gradients = [
    'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #14b8a6 100%)',
    'linear-gradient(135deg, #451a03 0%, #78350f 50%, #d97706 100%)',
    'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
    'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
    'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
  ]
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

function generatePlaceholderHTML(title, fileType) {
  return `
    <div class="w-full h-full relative overflow-hidden" style="${generateGradient(title)}">
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30" />
      <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <div class="w-12 h-16 border-2 border-white/30 rounded flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="text-white font-medium text-xs leading-tight line-clamp-3" style="font-family: 'Playfair Display', serif;">
          ${title}
        </p>
      </div>
      <div class="absolute top-2 right-2">
        <span class="text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white/80 font-medium">
          ${fileType}
        </span>
      </div>
    </div>
  `
}

function SkeletonCard() {
  return (
    <div className="relative flex-shrink-0 w-36 md:w-40">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer" />
      </div>
      <div className="mt-3 px-1 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-800/50 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  )
}