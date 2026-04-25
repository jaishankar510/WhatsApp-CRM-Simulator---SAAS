import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../api/client'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = sessionStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email, name) => {
    try {
      const response = await api.post('/login/', { email, name })
      if (response.data.success) {
        const userData = { email, name }
        setUser(userData)
        sessionStorage.setItem('user', JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (email, name) => {
    try {
      const response = await api.post('/register/', { email, name })
      if (response.data.success) {
        const userData = { email, name, user_id: response.data.user_id }
        setUser(userData)
        sessionStorage.setItem('user', JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout/')
    } catch (error) {
      console.error('Logout error:', error)
    }
    setUser(null)
    sessionStorage.clear()
    localStorage.clear()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}