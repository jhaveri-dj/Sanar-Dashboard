import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import {
  SESSION_KEY,
  clearSession,
  hasSession,
  readSessionUser,
} from '../utils/authSession'

const ROLE_USERS = {
  clinician: { role: 'clinician', name: 'Sarah Mitchell' },
  patient:   { role: 'patient',   name: 'Alex Chen' },
  surgeon:   { role: 'surgeon',   name: 'Dr. James Ortiz' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSessionUser())

  useEffect(() => {
    function syncFromStorage() {
      if (!hasSession()) {
        setUser(null)
        return
      }
      setUser(readSessionUser())
    }

    syncFromStorage()

    function onPageShow(event) {
      if (event.persisted) syncFromStorage()
    }

    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('focus', syncFromStorage)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('focus', syncFromStorage)
    }
  }, [])

  function selectRole(role) {
    const userData = ROLE_USERS[role]
    if (!userData) return
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, selectRole, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
