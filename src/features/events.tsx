import { PageHeader, HeaderTwo } from '../components/header'
import Page from '../components/page'

const Events = () => {
  return (
    <Page title="Events - Philly Mah-Jawn Mahjong Club">
      <PageHeader text="Events" />
      {/* TODO: change width/height based on viewport */}
      <div className="w-full flex justify-center mt-8">
        <iframe
          src="https://calendar.google.com/calendar/embed?wkst=1&ctz=America%2FNew_York&showPrint=0&src=Nzc2NmEwMjY3NTkwOGVjNDgxMmZmMjBiOGNlMzQ4NDM2MDhjYmIyZmY4M2ZjZDZlZDIxNTBjMmYwZTA1MTNjNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=c3RzbWpqM2R0bWQ3dGdpOG84ZGVrNnJ0Zm1taTV0dDNAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23795548&color=%23ad1457"
          width="800"
          height="600"
        />
      </div>
      <HeaderTwo text="Past Events" className="mt-4" />
      <h3>TODO PRO 2025</h3>
      <h3>TODO PRO 2024</h3>
    </Page>
  )
}

export default Events
