import { twMerge } from 'tailwind-merge'

type SectionProps = {
  children?: React.ReactNode
  className?: string
}

const Section = ({ children, className }: SectionProps) => (
  <section
    className={twMerge(
      'px-2 md:px-0 py-8 odd:bg-background-primary even:bg-background-secondary odd:text-copy-primary even:text-copy-secondary',
      className
    )}
  >
    {children}
  </section>
)

export default Section
