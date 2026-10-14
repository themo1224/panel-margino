import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/context/auth-context'
import Spinner from '@/views/spinner/Spinner'

interface RequireAuthProps {
  children: React.ReactNode
}

/**
 * Protects FullLayout routes. Admins must use a separate Admin app.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading, user, clearSession } = useAuth()
  const location = useLocation()
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (isAdmin) {
      clearSession()
    }
  }, [isAdmin, clearSession])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated || isAdmin) {
    return (
      <Navigate
        to="/auth/auth2/login"
        replace
        state={{
          from: location.pathname,
          adminBlocked: isAdmin,
        }}
      />
    )
  }

  return children
}
