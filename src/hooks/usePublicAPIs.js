import { useState, useEffect } from 'react'

export function usePublicAPIs() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAPI = async (url) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchAPI }
}

export const publicApis = {
  randomUser: () => fetch('https://randomuser.me/api/').then(r => r.json()),
  randomDog: () => fetch('https://dog.ceo/api/breeds/image/random').then(r => r.json()),
  randomCat: () => fetch('https://api.thecatapi.com/v1/images/search').then(r => r.json()),
  joke: () => fetch('https://v2.jokeapi.dev/joke/Any').then(r => r.json()),
  quote: () => fetch('https://zenquotes.io/api/random').then(r => r.json()),
  ip: () => fetch('https://api.ipify.org?format=json').then(r => r.json()),
  countries: () => fetch('https://restcountries.com/v3.1/all?fields=name,flag,population').then(r => r.json()),
  weather: (city, apiKey) => 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(r => r.json()),
  nasaApod: (apiKey) => 
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`).then(r => r.json()),
  cryptoPrice: (coin) => 
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`).then(r => r.json()),
}
