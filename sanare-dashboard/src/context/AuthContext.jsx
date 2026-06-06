import { createContext, useContext, useState } from 'react'

const CREDENTIALS = {
  'dr.sarah@sanare.com': { password: 'clinic123', role: 'clinician', name: 'Dr. Sarah Mitchell' },
  'alex@patient.com':    { password: 'patient123', role: 'patient',   name: 'Alex Chen' },
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sanare_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  function login(email, password) {
    const match = CREDENTIALS[email.toLowerCase()]
    if (!match || match.password !== password) {
      return { success: false, error: 'Invalid email or password.' }
    }
    const userData = { email: email.toLowerCase(), role: match.role, name: match.name }
    localStorage.setItem('sanare_user', JSON.stringify(userData))
    setUser(userData)
    return { success: true, role: match.role }
  }

  function logout() {
    localStorage.removeItem('sanare_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
