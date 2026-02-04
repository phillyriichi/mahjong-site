import { useEffect, useState } from 'react'
import { getAuth, onIdTokenChanged, type User } from 'firebase/auth'

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)

        const idTokenResult = await firebaseUser.getIdTokenResult()

        setIsAdmin(!!idTokenResult.claims.admin)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, isAdmin, isLoading }
}
