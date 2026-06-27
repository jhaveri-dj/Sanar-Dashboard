import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_HOME, PORTAL_ENTRY } from '../../constants/authRoutes'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const entry = requiredRole ? PORTAL_ENTRY[requiredRole] : '/login'
    return <Navigate to={entry} replace state={{ from: location.pathname }} />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/login'} replace />
  }

  return children
}
