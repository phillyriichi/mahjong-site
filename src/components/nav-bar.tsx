import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Link } from 'wouter'
import { PHILEAGUE_SPA_ROUTES, SPA_ROUTES } from '../route-paths'

const phileaguePages = [
  {
    name: 'Rankings',
    description: 'View current league rankings',
    href: PHILEAGUE_SPA_ROUTES.RANKINGS
  },
  {
    name: 'Score Entry',
    description: 'Enter score for a league game',
    href: PHILEAGUE_SPA_ROUTES.SCORE_ENTRY
  },
  {
    name: 'Game Logs',
    description: 'View history of league games',
    href: PHILEAGUE_SPA_ROUTES.GAME_LOGS
  },
  {
    name: 'Game Shuffle',
    description: 'Shuffle players for league games',
    href: PHILEAGUE_SPA_ROUTES.GAME_SHUFFLE
  }
]

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-background-brand-primary">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Philly Mah-Jawn Mahjong Club</span>
            {/* TODO: replace with our logo */}
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
              className="h-8 w-auto"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
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

          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-lg font-semibold text-copy-brand-primary">
              Phileague
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-copy-brand-primary"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-background-brand-secondary outline-1 -outline-offset-1 outline-white/10 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {phileaguePages.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-white/5"
                  >
                    <div className="flex-auto">
                      <Link
                        href={item.href}
                        className="block font-semibold text-copy-brand-primary"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-copy-brand-secondary">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Link href={SPA_ROUTES.EVENTS} className="text-lg font-semibold text-copy-brand-primary">
            Events
          </Link>
          <Link href={SPA_ROUTES.GALLERY} className="text-lg font-semibold text-copy-brand-primary">
            Gallery
          </Link>
          <a
            href={SPA_ROUTES.CONTACT_US}
            className="text-lg font-semibold text-copy-brand-primary"
          >
            Contact
          </a>
        </PopoverGroup>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background-brand-secondary p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Philly Mah-Jawn Mahjong Club</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-copy-brand-primary hover:bg-white/5">
                    Phileague
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-open:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {phileaguePages.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-copy-brand-primary hover:bg-white/5"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
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
                <a
                  href={SPA_ROUTES.CONTACT_US}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-copy-brand-primary hover:bg-white/5"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

export default NavBar
