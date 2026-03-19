import { useMemo, useState } from 'react'
import LogoSmall from '../assets/Logo_Small.png'
import { Link } from 'wouter'
import { SPA_ROUTES } from '../route-paths'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Accordion,
  AccordionItem
} from '@heroui/react'
import { useAdminAuth } from './useAdminAuth'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

const NavBar = () => {
  const [mobileMenuOpen, _] = useState(false)
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
            {isAdmin ? (
              <div>
                <Button
                  as={Link}
                  href={SPA_ROUTES.ADMIN}
                  className="mt-3"
                  color="primary"
                  size="sm"
                >
                  {' '}
                  Admin{' '}
                </Button>
              </div>
            ) : (
              <></>
            )}
            <Button
              className="mt-3"
              color="danger"
              size="sm"
              onPress={() => {
                signOut(auth)
              }}
            >
              Sign out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    ) : (
      <NavbarItem>
        <Button
          variant="ghost"
          className="text-copy-brand-primary font-semibold"
          onPress={async () => {
            await signInWithPopup(auth, googleProvider)
          }}
        >
          Sign In
        </Button>
      </NavbarItem>
    )
  }, [user, isAdmin])

  const navBarItems = [
    { text: 'Home', href: SPA_ROUTES.HOME },
    { text: 'League', href: SPA_ROUTES.LEAGUE },
    {
      text: 'Events',
      href: SPA_ROUTES.EVENTS_CALENDAR,
      dropdownItems: [
        { text: 'Calendar', href: SPA_ROUTES.EVENTS_CALENDAR },
        { text: 'PRO2025', href: SPA_ROUTES.EVENTS_PRO2025 }
      ]
    },
    { text: 'Gallery', href: SPA_ROUTES.GALLERY },
    { text: 'Contact', href: SPA_ROUTES.CONTACT_US }
  ]

  return (
    <Navbar className="bg-background-brand-primary">
      <NavbarBrand>
        <a href={SPA_ROUTES.HOME} className="-m-1.5 p-1.5 flex items-center gap-3">
          <img src={LogoSmall} className="h-12 w-auto" alt="Logo" />
          <h1 className="hidden lg:block text-xl md:text-2xl font-bold tracking-tight text-copy-brand-primary">
            Philly Mah-Jawn Mahjong Club
          </h1>
        </a>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-8" justify="end">
        {navBarItems.map((item) =>
          item.dropdownItems ? (
            <Dropdown
              key={item.text}
              classNames={{
                content: 'p-0 border-0 shadow-xl'
              }}
            >
              <NavbarItem>
                <DropdownTrigger>
                  <p className="text-lg font-semibold text-copy-brand-primary cursor-pointer">
                    {item.text}
                  </p>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="events-dropdown"
                classNames={{
                  base: 'p-0 min-w-[200px]',
                  list: 'bg-background-brand-primary rounded-md border border-divider shadow-md'
                }}
                itemClasses={{
                  base: 'gap-4 px-3 py-2',
                  title: 'text-lg text-copy-brand-primary'
                }}
              >
                {item.dropdownItems.map((dropdownItem) => (
                  <DropdownItem
                    key={dropdownItem.href}
                    textValue={dropdownItem.text}
                    as={Link}
                    href={dropdownItem.href}
                    className="data-[hover=true]:bg-blue-50"
                  >
                    {dropdownItem.text}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ) : (
            <NavbarItem key={item.href}>
              <Link href={item.href} className="text-lg font-semibold text-copy-brand-primary">
                {item.text}
              </Link>
            </NavbarItem>
          )
        )}
        {userAvatar}
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} />
        {userAvatar}
      </NavbarContent>

      <NavbarMenu className="bg-background-brand-primary">
        {navBarItems.map((item, index) =>
          item.dropdownItems ? (
            <div className="w-full" key={item.text}>
              <Accordion
                showDivider={false}
                hideIndicator
                className="p-0"
                itemClasses={{
                  base: 'py-0 w-full',
                  title: 'text-lg font-semibold text-copy-brand-primary py-0',
                  trigger: 'px-0 py-0 h-auto',
                  content: 'pt-2 pb-4'
                }}
              >
                <AccordionItem key="events" aria-label="Events" title={item.text}>
                  <div className="flex flex-col gap-3 pl-4">
                    {item.dropdownItems.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        className="text-copy-brand-primary hover:text-primary transition-colors"
                      >
                        {dropdownItem.text}
                      </Link>
                    ))}
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <NavbarMenuItem key={item.href}>
              <Link
                className="w-full text-lg font-semibold text-copy-brand-primary"
                color={
                  index === 2
                    ? 'warning'
                    : index === navBarItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href={item.href}
              >
                {item.text}
              </Link>
            </NavbarMenuItem>
          )
        )}
      </NavbarMenu>
    </Navbar>
  )
}

export default NavBar
