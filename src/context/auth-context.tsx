import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchMe,
  logout as apiLogout,
  updateMe,
  type AuthUser,
  type TokenResponse,
  type UpdateMePayload,
} from '@/api/auth'
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
  setUnauthorizedHandler,
} from '@/api/client'

interface AuthContextValue {
  user: AuthUser | null
  token: string
  isLoading: boolean
  isAuthenticated: boolean
  setSession: (session: TokenResponse) => void
  clearSession: () => void
  updateProfile: (payload: UpdateMePayload) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearSession = useCallback(() => {
    clearStoredToken()
    setToken('')
    setUser(null)
  }, [])

  const setSession = useCallback((session: TokenResponse) => {
    setStoredToken(session.token)
    setToken(session.token)
    setUser(session.user)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken('')
      setUser(null)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const stored = getStoredToken()
      if (!stored) {
        if (!cancelled) {
          setIsLoading(false)
        }
        return
      }

      try {
        const me = await fetchMe(stored)
        if (!cancelled) {
          setToken(stored)
          setUser(me)
        }
      } catch {
        if (!cancelled) {
          clearStoredToken()
          setToken('')
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void hydrate()

    return () => {
      cancelled = true
    }
  }, [])

  const updateProfile = useCallback(async (payload: UpdateMePayload) => {
    const updated = await updateMe(payload)
    setUser(updated)
    return updated
  }, [])

  const logout = useCallback(async () => {
    try {
      if (getStoredToken()) {
        await apiLogout()
      }
    } catch {
      // Clear local session anyway.
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      setSession,
      clearSession,
      updateProfile,
      logout,
    }),
    [user, token, isLoading, setSession, clearSession, updateProfile, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
