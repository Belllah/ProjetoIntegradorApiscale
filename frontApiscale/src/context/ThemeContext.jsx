import { createContext, useContext, useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'apiscale-theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme !== null) {
      return savedTheme === 'dark'
    }
    // Preferência do sistema se não houver preferência salva
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    document.documentElement.setAttribute('data-bs-theme', theme)
    if (isDark) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  const setDarkTheme = (value) => {
    setIsDark(Boolean(value))
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider.')
  }
  return context
}

