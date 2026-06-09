import { createContext, useContext, useState } from 'react'

const ROLE_USERS = {
  clinician: { role: 'clinician', name: 'Sarah Mitchell' },
  patient:   { role: 'patient',   name: 'Alex Chen' },
  surgeon:   { role: 'surgeon',   name: 'Dr. James Ortiz' },
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

  function selectRole(role) {
    const userData = ROLE_USERS[role]
    localStorage.setItem('sanare_user', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('sanare_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, selectRole, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
