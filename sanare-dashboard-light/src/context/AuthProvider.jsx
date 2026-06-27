import { useState } from 'react'
import { AuthContext } from './authContext'

const ROLE_USERS = {
  clinician: { role: 'clinician', name: 'Sarah Mitchell' },
  patient:   { role: 'patient',   name: 'Alex Chen' },
  surgeon:   { role: 'surgeon',   name: 'Dr. James Ortiz' },
}

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
    if (!userData) return
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
