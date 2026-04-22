import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('openbookdrive_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email) => {
    if (!email) {
      setError('Email requerido')
      return { success: false, error: 'Email requerido' }
    }

    if (!supabase) {
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        created_at: new Date().toISOString()
      }
      localStorage.setItem('openbookdrive_user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { success: true, user: mockUser }
    }

    try {
      setError(null)
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (supabaseError && supabaseError.code !== 'PGRST116') {
        throw supabaseError
      }

      let currentUser = data

      if (!currentUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ email, created_at: new Date().toISOString() }])
          .select()
          .single()

        if (insertError) throw insertError
        currentUser = newUser
      }

      localStorage.setItem('openbookdrive_user', JSON.stringify(currentUser))
      setUser(currentUser)
      return { success: true, user: currentUser }
    } catch (err) {
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        created_at: new Date().toISOString()
      }
      localStorage.setItem('openbookdrive_user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { success: true, user: mockUser }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('openbookdrive_user')
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (profileData) => {
    if (!user) return { success: false, error: 'No hay usuario' }

    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      },
      updated_at: new Date().toISOString()
    }

    localStorage.setItem('openbookdrive_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    return { success: true, user: updatedUser }
  }, [user])

  const updateStats = useCallback(async (action, bookTitle) => {
    if (!user) return { success: false, error: 'No hay usuario' }

    const newActivity = {
      user_id: user.id,
      user_email: user.email,
      action,
      book_title: bookTitle,
      created_at: new Date().toISOString()
    }

    if (supabase) {
      try {
        await supabase.from('activity_log').insert([newActivity])
      } catch (err) {
        console.error('Error logging activity:', err)
      }
    }

    const activities = JSON.parse(localStorage.getItem('openbookdrive_activities') || [])
    activities.push(newActivity)
    localStorage.setItem('openbookdrive_activities', JSON.stringify(activities))
  }, [user])

  return {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    updateStats,
    isSupabaseConnected: !!supabase,
  }
}

export { supabase }