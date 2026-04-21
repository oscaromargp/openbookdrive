<p align="center">
  <img src="assets/banner.png" alt="OpenBookDrive" width="100%"/>
</p>

<h1 align="center">OpenBookDrive</h1>

<p align="center">
  <strong>Biblioteca digital gratuita para compartir y descubrir libros. Acceso libre al conocimiento para todos.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge" alt="Version"/>
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/PRs-welcome-orange?style=for-the-badge" alt="PRs"/>
</p>

<p align="center">
  <a href="#-acerca-del-proyecto">Acerca</a> •
  <a href="#-características">Características</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-comenzando">Comenzando</a> •
  <a href="#-uso">Uso</a> •
  <a href="#-contacto">Contacto</a>
</p>

---

## 📖 Acerca del Proyecto

<p align="center">
  <img src="assets/screenshot.png" alt="Captura de pantalla principal" width="700"/>
</p>

**OpenBookDrive** es una plataforma web para compartir y descubrir libros de forma gratuita. Inspirada en Netflix, permite a los usuarios explorar una biblioteca digital organizada por géneros, con portadas de alta calidad, información detallada de cada libro (autor, descripción, año) y un sistema de colaboración comunitario.

El conocimiento pertenece a todos. OpenBookDrive es una plataforma donde la comunidad comparte libros libremente, sin barreras ni restricciones.

### 🛠️ Construido Con

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Google_Drive-4285F4?style=for-the-badge&logo=google-drive" alt="Google Drive"/>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase"/>
</p>

---

## ✨ Características

| Característica | Descripción |
|---|---|
| 🎨 **Interfaz Netflix** | Carruseles horizontales, hero destacado, diseño dark mode |
| 📖 **Metadatos Enriquecidos** | Autor, descripción, año, editorial vía OpenLibrary |
| 🔍 **Búsqueda en Tiempo Real** | Encuentra libros instantáneamente |
| 📤 **Sistema de Uploads** | Colaboradores pueden subir libros |
| 📩 **Sistema de Solicitudes** | Pide libros que necesitas |
| 🔐 **Auth por Email** | Sin contraseña, solo identificación |
| ☁️ **Google Drive** | Almacenamiento gratuito e ilimitado |
| 🌐 **Código Abierto** | MIT License, contribuciones bienvenidas |

---

## 🎬 Demo

<p align="center">
  <img src="assets/demo.gif" alt="Demo animado" width="700"/>
</p>

> ¿No puedes ver el GIF? [Haz clic aquí para ver el demo en video](https://github.com/oscaromargp/openbookdrive)

---

## 🚀 Comenzando

### Prerrequisitos

- Node.js — versión `>= 18.0`
- npm o yarn

### Instalación

1. Clona el repositorio
   ```sh
   git clone https://github.com/oscaromargp/openbookdrive.git
   cd openbookdrive
   ```

2. Instala las dependencias
   ```sh
   npm install
   ```

3. Configura las variables de entorno
   ```sh
   cp .env.example .env
   # Edita .env con tus valores
   ```

4. Inicia el proyecto
   ```sh
   npm run dev
   ```

### Configuración de Variables de Entorno

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

---

## 💡 Uso

### Exploring the Library

1. **Explora por géneros** — Navega los carruseles horizontales organizados por categoría
2. **Busca libros** — Usa la barra de búsqueda para encontrar títulos específicos
3. **Ver detalles** — Haz clic en cualquier libro para ver información completa

### Subiendo Libros

1. Haz clic en **"Subir"** en la barra de navegación
2. Inicia sesión con tu email
3. Serás redirigido a Google Drive donde puedes subir tus libros

### Solicitando Libros

1. Haz clic en **"Solicitudes"**
2. Busca el libro que necesitas
3. Envía tu solicitud a la comunidad

---

## 🤝 Contribuyendo

¡Las contribuciones son bienvenidas! Por favor lee las [guías de contribución](CONTRIBUTING.md).

1. Haz un fork del repositorio
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit: `git commit -m 'feat: agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 💖 Apoya este Proyecto

Si este proyecto te fue útil, considera hacer una contribución. Esto me ayuda a seguir creando herramientas de código abierto.

<p align="center">
  <strong>Donaciones en Criptomonedas — Red XRP</strong><br><br>
  <img src="https://img.shields.io/badge/XRP-rBthUCndKy3Xbb19Ln4xkZeMwusX9NrYfj-00AAE4?style=for-the-badge&logo=ripple" alt="XRP Address"/>
</p>

> Dirección XRP: `rBthUCndKy3Xbb19Ln4xkZeMwusX9NrYfj`

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

---

## 📬 Contacto

<p align="center">
  <strong>Oscar Omar Gómez Peña</strong>
</p>

<p align="center">
  <a href="https://oscaromargp.github.io/Oscaromargp/">
    <img src="https://img.shields.io/badge/Portafolio-Web-blueviolet?style=for-the-badge&logo=github" alt="Portafolio"/>
  </a>
  &nbsp;
  <a href="https://github.com/oscaromargp">
    <img src="https://img.shields.io/badge/GitHub-oscaromargp-181717?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
</p>

<p align="center">
  <a href="https://github.com/oscaromargp/openbookdrive">Ver Repositorio</a>
</p>

---

## 🙏 Agradecimientos

<p align="center">
  <br/>
  <em>
    "Porque Dios es el que en vosotros produce<br/>
    así el querer como el hacer,<br/>
    por su buena voluntad."
  </em>
  <br/>
  <strong>— Filipenses 2:13</strong>
  <br/><br/>
  Todo lo que aquí existe nació primero como un deseo en el corazón.<br/>
  Cada proyecto, cada línea, cada idea que toma forma —<br/>
  es un regalo de Aquel que nos dio tanto el sueño como la fuerza de alcanzarlo.<br/>
  <strong>A Dios, toda la gloria.</strong>
  <br/>
</p>

---

- [OpenLibrary](https://openlibrary.org) — por la API de libros
- [Google Drive API](https://developers.google.com/drive) — por el almacenamiento
- [Shields.io](https://shields.io) — por los badges
- [awesome-readme](https://github.com/matiassingers/awesome-readme) — por la inspiración