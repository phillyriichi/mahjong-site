import { auth, googleProvider } from './firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { Button } from '@heroui/button'
import { useAdminAuth } from './useAdminAuth'
import { Popover, PopoverTrigger, Avatar, PopoverContent } from '@heroui/react'

function LoginForm() {
  const { user, isAdmin, isLoading } = useAdminAuth()

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
      <div className="flex ml-4">
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Avatar
              src={user.photoURL ?? undefined}
              name={user.displayName ?? undefined}
              className="cursor-pointer"
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">{user.displayName}</div>
              {isAdmin ? <div className="text-tiny text-default-500">Admin</div> : <></>}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default LoginForm
