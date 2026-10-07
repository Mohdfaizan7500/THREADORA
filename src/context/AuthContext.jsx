import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/index.js'
import { DEMO_USER, DEMO_CREDENTIALS } from '../data/content.js'

const AuthContext = createContext(null)

// Demo-only authentication. Credentials are validated against a static demo
// account; there is no backend and nothing sensitive is stored.
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('threadora.user', null)
  const [registeredUsers, setRegisteredUsers] = useLocalStorage('threadora.users', [])
  const [loading, setLoading] = useState(false)

  const login = useCallback(
    async ({ identifier, password }) => {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 650)) // simulate network latency
      setLoading(false)

      const id = (identifier || '').trim().toLowerCase()
      const matchesDemo =
        (id === DEMO_CREDENTIALS.email || id === DEMO_USER.mobile.replace(/\s/g, '')) &&
        password === DEMO_CREDENTIALS.password
      const matchRegistered = registeredUsers.find(
        (u) => (u.email.toLowerCase() === id || u.mobile === identifier) && u.password === password,
      )

      if (matchesDemo) {
        setUser({ ...DEMO_USER })
        return { ok: true }
      }
      if (matchRegistered) {
        const { password: _pw, ...safe } = matchRegistered
        setUser({ ...safe, initials: initialsOf(safe.name) })
        return { ok: true }
      }
      return { ok: false, error: 'Invalid credentials. Try the demo account or create one.' }
    },
    [registeredUsers, setUser],
  )

  const continueAsGuest = useCallback(async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    setLoading(false)
    setUser({ ...DEMO_USER, name: 'Guest', initials: 'GU', guest: true })
    return { ok: true }
  }, [setUser])

  const register = useCallback(
    async ({ name, email, mobile, password }) => {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 700))
      setLoading(false)
      if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: 'An account with this email already exists.' }
      }
      setRegisteredUsers((prev) => [...prev, { name, email, mobile, password }])
      return { ok: true }
    },
    [registeredUsers, setRegisteredUsers],
  )

  const logout = useCallback(() => setUser(null), [setUser])

  const updateProfile = useCallback(
    (patch) => setUser((prev) => (prev ? { ...prev, ...patch, initials: initialsOf(patch.name || prev.name) } : prev)),
    [setUser],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      continueAsGuest,
      register,
      logout,
      updateProfile,
    }),
    [user, loading, login, continueAsGuest, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function initialsOf(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}