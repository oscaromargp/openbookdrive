# OpenBookDrive - Documentación del Proyecto

## 📚 Descripción

**OpenBookDrive** es una plataforma web para compartir y descubrir libros de forma gratuita. Inspirada en Netflix, permite a los usuarios explorar una biblioteca digital organizada por géneros, con portadas de alta calidad, información detallada de cada libro (autor, descripción, año) y un sistema de colaboración comunitario.

### Características Principales

- 🎨 **Interfaz visual estilo Netflix** - Carruseles horizontales, hero destacado
- 📖 **Metadatos enriquecidos** - Autor, descripción, año, editorial via OpenLibrary
- 🔍 **Búsqueda en tiempo real** - Encuentra libros instantáneamente
- 📤 **Sistema de uploads** - Colaboradores pueden subir libros
- 📩 **Sistema de solicitudes** - Pide libros que necesitas
- 🔐 **Identificación por email** - Sin contraseña, solo email
- ☁️ **Google Drive** - Almacenamiento gratuito e ilimitado

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    OPENBOOKDRIVE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FRONTEND (React + Vite + Tailwind)                       │
│  ├── App.jsx              - Componente principal           │
│  ├── hooks/                                                  │
│  │   ├── useGoogleDrive.js  - Integración Drive API        │
│  │   ├── useOpenLibrary.js  - Metadatos de libros         │
│  │   └── useAuth.js         - Autenticación                │
│  └── components/                                             │
│       ├── Hero.jsx          - Libro destacado             │
│       ├── BookCard.jsx      - Tarjeta de libro            │
│       ├── BookModal.jsx     - Detalle del libro           │
│       ├── BookRow.jsx       - Carrusel por género         │
│       ├── SearchBar.jsx      - Búsqueda                    │
│       ├── UploadModal.jsx    - Subir libros                │
│       ├── RequestModal.jsx  - Solicitar libros            │
│       ├── RequestList.jsx   - Lista de solicitudes        │
│       └── AuthModal.jsx     - Login por email             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BACKEND / STORAGE                                         │
│  ├── Google Drive API    - Almacenamiento de PDFs         │
│  ├── OpenLibrary API     - Metadatos de libros (gratis)   │
│  ├── Supabase (opcional) - Auth + DB para escalabilidad   │
│  └── localStorage        - Fallback sin backend            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React 18** | Framework UI |
| **Vite** | Build tool |
| **Tailwind CSS** | Estilos |
| **Google Drive API** | Storage de archivos |
| **OpenLibrary API** | Metadatos de libros |
| **Supabase** | Auth/DB (opcional) |

---

## 📋 Requisitos

### Variables de Entorno (.env)

```env
# Google Drive (requerido para producción)
VITE_GOOGLE_API_KEY=tu_google_api_key
VITE_GOOGLE_CLIENT_ID=tu_client_id
VITE_DRIVE_FOLDER_ID=id_de_carpeta_drive

# Google Drive Upload (URL de la carpeta)
VITE_DRIVE_UPLOAD_URL=https://drive.google.com/drive/folders/TU_CARPETA

# Supabase (opcional - funciona sin ellos)
VITE_SUPABASE_URL=https://tu_proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

### Cómo obtener credenciales

#### Google Drive API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto
3. Habilita "Google Drive API"
4. Credenciales → API Key + OAuth 2.0
5. Comparte tu carpeta Drive con "Cualquiera con el enlace"

#### OpenLibrary API
- **Gratis, sin API key requerida**
- Documentación: https://openlibrary.org/dev/docs/api

---

## 🚀 Instalación

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/openbookdrive.git
cd openbookdrive

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
# Edita con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

---

## 📖 Flujos de Usuario

### 1. Explorar Libros
```
Landing → Ver carruseles por género → Click en libro → Modal detalle
```

### 2. Buscar
```
Click en lupa → Escribir título/autor → Ver resultados → Click en libro
```

### 3. Subir un Libro
```
Click "Subir" → Login (email) → Formulario: título, autor, género → Redirige a Drive
```

### 4. Solicitar un Libro
```
Click "Solicitudes" → Login (email) → Buscar libro → Enviar solicitud
```

### 5. Descargar
```
Click "Descargar" en modal → Login prompt (si no hay sesión) → Registrar download → Redirect Drive
```

---

## 📊 Estructura de Datos

### Book (desde Google Drive + OpenLibrary)
```javascript
{
  id: string,           // Drive file ID
  title: string,        // Título del libro
  name: string,        // Nombre original del archivo
  author: string,      // Autor (OpenLibrary)
  genre: string,       // Género detectado/manual
  year: number,        // Año de publicación
  cover: string,        // URL portada HD
  thumbnail: string,    // URL portada thumbnail
  downloadUrl: string, // URL de descarga Drive
  viewUrl: string,     // URL de vista Drive
  size: number,        // Tamaño en bytes
  pages: number,       // Número de páginas
  subjects: string[],   // Temas/categorías
  publisher: string    // Editorial
}
```

### Request (solicitudes de libros)
```javascript
{
  id: number,
  userEmail: string,
  title: string,
  author: string,
  year: number,
  cover: string,
  requestedAt: ISO date string,
  status: 'pendiente' | 'completado'
}
```

---

## 🎨 Decisiones de Diseño

### UI/UX
- **Dark mode** - Fondo oscuro (#0a0a0f) para mejor experiencia de lectura
- **Red accent** - Color primario rojo (#dc2626) para CTAs
- **Glassmorphism** - Efectos de transparencia en navbars y modals
- **Netflix style** - Hero grande + carruseles horizontales

### Sistema de Auth
- **Email only** - Sin contraseña, solo identificación por email
- **localStorage fallback** - Funciona sin Supabase
- **Graceful degradation** - Todo funciona con localStorage si no hay DB

### Almacenamiento
- **Google Drive** - Storage gratuito e ilimitado
- **OpenLibrary** - Metadatos gratuitos sin límite
- **No hay costo** - Todo funciona en free tier

---

## 🔧 Configuración de Supabase (Opcional)

Si quieres persistencia real en lugar de localStorage:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de solicitudes
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  author TEXT,
  year INTEGER,
  cover TEXT,
  status TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de logs de actividad
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  user_email TEXT,
  action TEXT,
  book_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
```

---

## 📁 Archivos del Proyecto

```
openbookdrive/
├── src/
│   ├── hooks/
│   │   ├── useGoogleDrive.js    # Fetch libros desde Drive
│   │   ├── useOpenLibrary.js    # Search y metadatos
│   │   └── useAuth.js           # Login/logout
│   ├── components/
│   │   ├── Hero.jsx             # Banner principal
│   │   ├── BookCard.jsx         # Tarjeta книги
│   │   ├── BookModal.jsx        # Detalle libro
│   │   ├── BookRow.jsx          # Carrusel género
│   │   ├── SearchBar.jsx        # Búsqueda
│   │   ├── UploadModal.jsx      # Subir libro
│   │   ├── RequestModal.jsx     # Solicitar libro
│   │   ├── RequestList.jsx      # Ver solicitudes
│   │   └── AuthModal.jsx        # Login
│   ├── App.jsx                  # Main app
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind imports
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── APIS.md                      # Referencia de APIs
├── PROJECT.md                   # Este archivo
└── README.md                    # README GitHub
```

---

## 🌐 APIs Utilizadas

### OpenLibrary (Gratis)
- **Search**: `https://openlibrary.org/search.json?q={query}`
- **Book by ISBN**: `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json`
- **Covers**: `https://covers.openlibrary.org/b/id/{cover_id}-{size}.jpg`
- **Detalles**: `https://openlibrary.org{work_key}.json`

### Google Drive (API Key)
- **List files**: `https://www.googleapis.com/drive/v3/files`
- **Thumbnail**: `https://drive.google.com/thumbnail?id={file_id}&sz=w400`
- **Download**: `https://drive.google.com/uc?export=download&id={file_id}`

---

## 🚢 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Variables en Vercel
- `VITE_GOOGLE_API_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_DRIVE_FOLDER_ID`
- `VITE_DRIVE_UPLOAD_URL`
- (Opcional) `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## ⚠️ Notas Importantes

1. **Carpeta Drive pública** - Los libros deben estar en una carpeta compartida con "Cualquiera con el enlace"
2. **CORS** - Google Drive puede tener límites de rate; implementar caché si es necesario
3. **Fallback** - Si no hay credenciales, muestra datos demo
4. **PDFs** - El visor de Google Drive permite previsualizar PDFs

---

## 🤝 Contribuir

1. Fork del repo
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: descripción'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

---

## 📄 Licencia

MIT - Ver LICENSE para más detalles.

---

## 👤 Autor

**Oscar Omar Gómez Peña**
- GitHub: @oscaromargp
- XRP: rBthUCndKy3Xbb19Ln4xkZeMwusX9NrYfj
