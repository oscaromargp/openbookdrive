<p align="center">
  <img src="https://raw.githubusercontent.com/oscaromargp/openbookdrive/main/public/banner.png" alt="OpenBookDrive Banner" width="100%" />
</p>

<p align="center">
  <a href="https://openbookdrive.vercel.app">
    <img src="https://img.shields.io/badge/Live-Demo-red?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/oscaromargp/openbookdrive/stargazers">
    <img src="https://img.shields.io/github/stars/oscaromargp/openbookdrive?style=for-the-badge&logo=github" alt="Stars" />
  </a>
  <a href="https://github.com/oscaromargp/openbookdrive/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/oscaromargp/openbookdrive?style=for-the-badge" alt="License" />
  </a>
  <a href="https://vercel.com/?utm_source=openbookdrive&utm_campaign=oss">
    <img src="https://img.shields.io/badge/Powered_by-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel" />
  </a>
</p>

---

<p align="center">
  <strong>📚 OpenBookDrive</strong> — Biblioteca digital gratuita para compartir y descubrir libros. Acceso libre al conocimiento para todos.
</p>

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-características">Características</a> •
  <a href="#-tecnologías">Tecnologías</a> •
  <a href="#-instalación">Instalación</a> •
  <a href="#-configuración">Configuración</a> •
  <a href="#-deploy">Deploy</a> •
  <a href="#-contribuir">Contribuir</a>
</p>

---

## 📸 Demo Visual

<p align="center">
  <img src="https://raw.githubusercontent.com/oscaromargp/openbookdrive/main/public/screenshot.png" alt="OpenBookDrive Screenshot" width="100%" />
</p>

> **Nota**: La imagen anterior es una representación visual. Visita [openbookdrive.vercel.app](https://openbookdrive.vercel.app) para ver la aplicación en vivo.

---

## ✨ Características

| Característica | Descripción |
|----------------|-------------|
| 🎨 **Interfaz Netflix** | Carruseles horizontales, hero destacado, diseño dark mode |
| 📖 **Metadatos Enriquecidos** | Autor, descripción, año, editorial vía OpenLibrary |
| 🔍 **Búsqueda en Tiempo Real** | Encuentra libros instantáneamente |
| 📤 **Sistema de Uploads** | Colaboradores pueden subir libros |
| 📩 **Sistema de Solicitudes** | Pide libros que necesitas |
| 🔐 **Auth por Email** | Sin contraseña, solo identificación |
| ☁️ **Google Drive** | Almacenamiento gratuito e ilimitado |
| 🌐 **Código Abierto** | MIT License, contribuciones bienvenidas |

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
│       ├── Hero.jsx          - Libro destacado              │
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

## 🛠️ Tecnologías

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,vercel,googlecloud,supabase" />
</p>

| Tecnología | Uso |
|------------|-----|
| **React 18** | Framework UI |
| **Vite** | Build tool |
| **Tailwind CSS** | Estilos |
| **Google Drive API** | Storage de archivos |
| **OpenLibrary API** | Metadatos de libros |
| **Supabase** | Auth/DB (opcional) |

---

## 🚀 Instalación

```bash
# Clonar el proyecto
git clone https://github.com/oscaromargp/openbookdrive.git
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

## ⚙️ Configuración

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

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm run build
vercel --prod
```

### Variables en Vercel

| Variable | Descripción |
|----------|-------------|
| `VITE_GOOGLE_API_KEY` | Clave API de Google |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de OAuth |
| `VITE_DRIVE_FOLDER_ID` | ID de carpeta Drive |
| `VITE_DRIVE_UPLOAD_URL` | URL para subir archivos |
| `VITE_SUPABASE_URL` | URL de Supabase (opcional) |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima (opcional) |

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestras [guías de contribución](CONTRIBUTING.md) primero.

1. Fork del repo
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: descripción'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 💚 Donaciones

Si te gusta este proyecto y quieres apoiar su desarrollo,acceptamos donaciones en **XRP** (red Ripple):

```
rBthUCndKy3Xbb19Ln4xkZeMwusX9NrYfj
```

<p align="center">
  <img src="https://img.shields.io/badge/XRP_Donate-00d395?style=for-the-badge&logo=xrp" alt="Donate XRP" />
</p>

---

## 👤 Autor

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/xxx?s=100&v=4" alt="Oscar Omar Gómez Peña" style="border-radius: 50%;" />
</p>

<p align="center">
  <strong>Oscar Omar Gómez Peña</strong>
</p>

<p align="center">
  <a href="https://github.com/oscaromargp">
    <img src="https://img.shields.io/badge/GitHub-@oscaromargp-181717?style=flat&logo=github" alt="GitHub" />
  </a>
  <a href="https://oscaromargp.github.io/Oscaromargp/">
    <img src="https://img.shields.io/badge/Portafolio-Web-0077B5?style=flat&logo=google-chrome" alt="Portafolio" />
  </a>
</p>

---

<p align="center">
  <sub>Hecho con ❤️ por <a href="https://github.com/oscaromargp">Oscar Omar Gómez Peña</a></sub>
</p>

<p align="center">
  <a href="https://vercel.com/?utm_source=openbookdrive&utm_campaign=oss">
    <img src="https://simpleicons.org/icons/vercel.svg" width="30" height="30" alt="Powered by Vercel" />
  </a>
</p>