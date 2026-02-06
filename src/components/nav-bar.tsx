import { useMemo, useState } from 'react'
import { Dialog, DialogPanel, PopoverGroup } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'wouter'
import { SPA_ROUTES } from '../route-paths'
import { Avatar, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { useAdminAuth } from './useAdminAuth'

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAdmin } = useAdminAuth()

  const userAvatar = useMemo(() => {
    return user ? (
      <Popover placement="bottom" showArrow={true}>
        <PopoverTrigger>
          <Avatar src={user.photoURL ?? undefined} name={user.displayName ?? undefined} size="sm" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">{user.displayName}</div>
            {isAdmin ? <div className="text-tiny text-default-500">Admin</div> : <></>}
          </div>
        </PopoverContent>
      </Popover>
    ) : (
      <></>
    )
  }, [user, isAdmin])

  return (
    <header className="bg-background-brand-primary">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href={SPA_ROUTES.HOME} className="-m-1.5 p-1.5">
            <span className="sr-only">Philly Mah-Jawn Mahjong Club</span>
            {/* TODO: replace with our logo */}
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
              className="h-8 w-auto"
            />
          </a>
        </div>
        <div className="flex gap-2 lg:hidden">
          <div> {userAvatar} </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link href={SPA_ROUTES.HOME} className="text-lg font-semibold text-copy-brand-primary">
            Home
          </Link>
          <Link href={SPA_ROUTES.LEAGUE} className="text-lg font-semibold text-copy-brand-primary">
            League
          </Link>
          <Link href={SPA_ROUTES.EVENTS} className="text-lg font-semibold text-copy-brand-primary">
            Events
          </Link>
          <Link href={SPA_ROUTES.GALLERY} className="text-lg font-semibold text-copy-brand-primary">
            Gallery
          </Link>
          <Link
            href={SPA_ROUTES.CONTACT_US}
            className="text-lg font-semibold text-copy-brand-primary"
          >
            Contact
          </Link>
          <Link href={SPA_ROUTES.ADMIN} className="text-lg font-semibold text-copy-brand-primary">
            Admin
          </Link>
          <div> {userAvatar} </div>
        </PopoverGroup>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background-brand-secondary p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href={SPA_ROUTES.HOME} className="-m-1.5 p-1.5">
              <span className="sr-only">Philly Mah-Jawn Mahjong Club</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex gap-2 lg:hidden">
              <div> {userAvatar} </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                <Link
                  href={SPA_ROUTES.LEAGUE}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-copy-brand-primary hover:bg-white/5"
                >
                  League
                </Link>
                <Link
                  href={SPA_ROUTES.EVENTS}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-copy-brand-primary hover:bg-white/5"
                >
                  Events
                </Link>
                <Link
                  href={SPA_ROUTES.GALLERY}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-copy-brand-primary hover:bg-white/5"
                >
                  Gallery
                </Link>
                <Link
                  href={SPA_ROUTES.CONTACT_US}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-copy-brand-primary hover:bg-white/5"
                >
                  Contact
                </Link>
                <Link
                  href={SPA_ROUTES.ADMIN}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-copy-brand-primary hover:bg-white/5"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

export default NavBar
