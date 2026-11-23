import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const STORAGE_KEY = 'apiscale_funcionario_id'

const UserContext = createContext(null)

export function getInitials(fullName = '') {
  const clean = fullName.trim()
  if (!clean) return 'US'

  const parts = clean.split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }

  return clean.slice(0, 2).toUpperCase()
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const funcionarioId = Number(localStorage.getItem(STORAGE_KEY)) || 1

  const loadUser = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/funcionarios/${funcionarioId}`)
      if (!response.ok) {
        throw new Error(`Erro ao carregar funcionário (HTTP ${response.status}).`)
      }

      const data = await response.json()
      setUser(data)
    } catch (err) {
      setError(err.message || 'Não foi possível conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }, [funcionarioId])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const initials = getInitials(user?.nome || 'Isabella')

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        initials,
        loading,
        error,
        refreshUser: loadUser,
        apiBaseUrl: API_BASE_URL,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider.')
  }
  return context
}