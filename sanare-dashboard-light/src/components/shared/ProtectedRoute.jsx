import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_HOME } from '../../constants/authRoutes'
import { hasSession } from '../../utils/authSession'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()
  const location = useLocation()

  // Always trust storage — bfcache can restore stale React auth after sign-out.
  if (!hasSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/login'} replace />
  }

  return children
}
