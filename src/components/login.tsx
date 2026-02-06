import { auth, googleProvider } from './firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { Button } from '@heroui/button'
import { useAdminAuth } from './useAdminAuth'

function LoginForm() {
  const { user, isLoading } = useAdminAuth()

  if (!user || isLoading) {
    return (
      <Button
        color="primary"
        onPress={async () => {
          await signInWithPopup(auth, googleProvider)
        }}
      >
        Sign in
      </Button>
    )
  }

  return (
    <div className="flex">
      <Button
        color="danger"
        onPress={() => {
          signOut(auth)
        }}
      >
        Sign out
      </Button>
    </div>
  )
}

export default LoginForm
