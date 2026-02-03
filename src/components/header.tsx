import { twMerge } from 'tailwind-merge'

type HeaderProps = {
  text: string
  className?: string
}

export const Header = ({ text, className }: HeaderProps) => (
  <h1 className={twMerge('text-header-primary font-bold text-2xl', className)}>{text}</h1>
)

export const PageHeader = ({ text, className }: HeaderProps) => (
  <Header text={text} className={`w-full text-center text-4xl ${className ?? ''}`} />
)

export const HeaderTwo = ({ text, className }: HeaderProps) => (
  <h2 className={twMerge('text-header-primary font-semibold text-xl', className)}>{text}</h2>
)

export const HeaderThree = ({ text, className }: HeaderProps) => (
  <h2 className={twMerge('text-header-secondary font-semibold text-lg', className)}>{text}</h2>
)
