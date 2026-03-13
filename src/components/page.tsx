import Footer from './footer'
import NavBar from './nav-bar'

type PageProps = {
  title: string
  children?: React.ReactNode
  footerClassName?: string
}

const Page = ({ title, children, footerClassName }: PageProps) => {
  return (
    <>
      <title>{title}</title>
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer className={footerClassName ?? ''} />
    </>
  )
}

export default Page
