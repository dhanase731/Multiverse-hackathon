import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { N8N } from '../config'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('era_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  const syncUserToMongo = useCallback(async (profile) => {
    try {
      await fetch(N8N.SYNC_USER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          gmailConnected: !!profile.accessToken,
          syncedAt: new Date().toISOString(),
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
        }),
      })
    } catch (err) {
      console.error('User sync failed:', err)
    }
  }, [])

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      await handleSession(session)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [syncUserToMongo])

  const handleSession = async (session) => {
    if (session) {
      const userObj = session.user
      const providerToken = session.provider_token
      const providerRefreshToken = session.provider_refresh_token
      
      const profile = {
        sub: userObj.id,
        email: userObj.email,
        name: userObj.user_metadata?.full_name || userObj.user_metadata?.name,
        picture: userObj.user_metadata?.avatar_url || userObj.user_metadata?.picture,
        accessToken: providerToken || null,
        refreshToken: providerRefreshToken || null,
      }

      // Read current cached user from localStorage
      let cachedUser = null
      try {
        cachedUser = JSON.parse(localStorage.getItem('era_user'))
      } catch (e) {}

      // Only sync if the profile information or tokens have changed
      const hasChanged = !cachedUser ||
        cachedUser.sub !== profile.sub ||
        cachedUser.email !== profile.email ||
        cachedUser.accessToken !== profile.accessToken ||
        cachedUser.refreshToken !== profile.refreshToken

      if (hasChanged) {
        await syncUserToMongo(profile)
      }
      
      localStorage.setItem('era_user', JSON.stringify(profile))
      setUser(profile)
    } else {
      localStorage.removeItem('era_user')
      setUser(null)
    }
    setLoading(false)
  }

  const signIn = useCallback(async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/onboarding',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify'
      }
    })
    if (error) {
      console.error('OAuth error:', error)
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('era_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
