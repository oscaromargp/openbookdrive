import { useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useGoogleDrive } from './hooks/useGoogleDrive'
import { useAuth } from './hooks/useAuth'
import Fuse from 'fuse.js'
import Hero from './components/Hero'
import BookRow from './components/BookRow'
import BookModal from './components/BookModal'
import SearchBar from './components/SearchBar'
import UploadModal from './components/UploadModal'
import RequestModal from './components/RequestModal'
import RequestList from './components/RequestList'
import AuthModal from './components/AuthModal'
import ProfileModal from './components/ProfileModal'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'
import Landing from './pages/Landing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/libros" element={<MainApp />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/landing" element={<Landing />} />
    </Routes>
  )
}