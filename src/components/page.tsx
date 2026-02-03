import Footer from './footer'
import NavBar from './nav-bar'

type PageProps = {
  title: string
  children?: React.ReactNode
}

const Page = ({ title, children }: PageProps) => {
  return (
    <>
      <title>{title}</title>
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}

export default Page
