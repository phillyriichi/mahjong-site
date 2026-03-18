import { twMerge } from 'tailwind-merge'

type ConstrainedDivProps = {
  children?: React.ReactNode
  className?: string
}

const ConstrainedDiv = ({ children, className }: ConstrainedDivProps) => (
  <div className={twMerge('max-w-[1200px] mx-auto', className)}>{children}</div>
)

export default ConstrainedDiv
