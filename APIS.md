# 📚 APIs Públicas para Proyectos Futuros

> **Nota:** Este archivo contiene referencias de APIs. Ver `PROJECT.md` para documentación completa.

---

## 📚 OpenLibrary API (Proyecto OpenBookDrive)

API gratuita para metadatos de libros: título, autor, descripción, portadas, ISBN.

| Endpoint | Descripción |
|----------|-------------|
| `https://openlibrary.org/search.json?q={query}` | Buscar libros |
| `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}` | Por ISBN |
| `https://covers.openlibrary.org/b/id/{id}-{S,M,L}.jpg` | Portadas |

---

## 🌐 APIs Esenciales (No requieren API Key)

| API | Descripción | Endpoint |
|-----|-------------|----------|
| **JSONPlaceholder** | API mock para testing | `https://jsonplaceholder.typicode.com` |
| **The Dog API** | Imágenes de perros | `https://dog.ceo/api/breeds/image/random` |
| **The Cat API** | Imágenes de gatos | `https://api.thecatapi.com/v1/images/search` |
| **RandomUser** | Datos de usuarios mock | `https://randomuser.me/api/` |
| **JokeAPI** | Chistes aleatorios | `https://v2.jokeapi.dev/joke/Any` |
| **ZenQuotes** | Citas motivacionales | `https://zenquotes.io/api/random` |
| **OpenLibrary** | Datos de libros | `https://openlibrary.org/api/books` |
| **IPify** | IP pública del cliente | `https://api.ipify.org?format=json` |
| **Rest Countries** | Información de países | `https://restcountries.com/v3.1/all` |

## 🌤️ Clima

| API | Free Tier | Notas |
|-----|-----------|-------|
| **OpenWeatherMap** | 60 calls/min | Requiere API key |
| **Tomorrow.io** | 500 calls/day | Excelente precisión |
| **WeatherAPI** | 1M calls/month | Muy generoso |

## 💰 Finanzas / Crypto

| API | Descripción |
|-----|-------------|
| **CoinGecko** | Precios crypto (gratis) |
| **Frankfurter** | Exchange rates EUR |
| **CurrencyConverter** | Conversor de divisas |

## 📰 Noticias

| API | Free Tier |
|-----|-----------|
| **NewsAPI** | 100 requests/day |
| **Hacker News API** | Sin límite |
| **Reddit API** | Requires auth |

## 🗺️ Maps / Geolocalización

| API | Free Tier |
|-----|-----------|
| **OpenStreetMap (Nominatim)** | Gratuito |
| **Mapbox** | 50K requests/month |
| **IPWhoIS** | 2K calls/day |

## 🤖 AI / ML

| API | Descripción |
|-----|-------------|
| **OpenAI API** | GPT models |
| **HuggingFace** | Modelos ML gratuitos |
| **Replicate** | Run ML models |

## 📸 Imágenes

| API | Descripción |
|-----|-------------|
| **Unsplash** | 50 requests/hour |
| **Pexels** | 200 requests/hour |
| **Lorem Picsum** | Imágenes aleatorias |

## 🎵 Música

| API | Descripción |
|-----|-------------|
| **Spotify** | Requires OAuth |
| **Deezer** | Preview de canciones |
| **Last.fm** | Datos de artistas |

## 🚀 NASA

| Endpoint | Descripción |
|----------|-------------|
| `https://api.nasa.gov/planetary/apod` | Foto astronómica del día |
| `https://api.nasa.gov/neo/feed` | Asteroides |
| `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos` | Fotos de Marte |

## 📱 Ejemplo de uso con fetch

```javascript
// Fetch random user
const user = await fetch('https://randomuser.me/api/').then(r => r.json());
console.log(user.results[0].name.first);

// Fetch joke
const joke = await fetch('https://v2.jokeapi.dev/joke/Any').then(r => r.json());
console.log(joke.setup || joke.joke);

// Weather con OpenWeatherMap
const weather = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=Madrid&appid=YOUR_KEY`
).then(r => r.json());
```

## 🔑 Cómo obtener API Keys

| API | URL para key |
|-----|--------------|
| OpenWeatherMap | https://openweathermap.org/api |
| NASA | https://api.nasa.gov |
| NewsAPI | https://newsapi.org |
| CoinGecko | https://www.coingecko.com |
| Mapbox | https://mapbox.com |
| Unsplash | https://unsplash.com/developers |
