import { useEffect, useMemo, useState } from 'react'
import { getSession, onAuthStateChange } from '@/utils/auth'
import { AuthContext } from '@/context/authContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then((currentSession) => {
      setSession(currentSession)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      isAuthenticated: Boolean(session),
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
