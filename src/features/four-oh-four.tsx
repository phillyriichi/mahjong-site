import { Link } from 'wouter'
import { PageHeader } from '../components/header'
import Page from '../components/page'

const FourOhFour = () => {
  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <PageHeader text="Page Not Found" />
      <div className="flex justify-center my-12">
        <Link className="text-xl" href="/">
          Go to home
        </Link>
      </div>
    </Page>
  )
}

export default FourOhFour
