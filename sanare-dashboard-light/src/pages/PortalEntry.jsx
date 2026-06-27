import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLE_HOME, PORTAL_LABELS } from '../constants/authRoutes'

export default function PortalEntry({ role }) {
  const { user, selectRole } = useAuth()
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (user?.role !== role) {
      selectRole(role)
    }
    setEntered(true)
  }, [role, selectRole, user?.role])

  if (entered && user?.role === role) {
    return <Navigate to={ROLE_HOME[role]} replace />
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4F5F7',
      fontFamily: 'Inter, sans-serif',
    }}>
      <p style={{ fontSize: 14, color: '#6B7280' }}>
        Opening {PORTAL_LABELS[role]}…
      </p>
    </div>
  )
}
