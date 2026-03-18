import { Link } from 'wouter'
import { Card, CardBody, CardHeader } from '@heroui/react'
import ConstrainedDiv from '../../components/constrained-div'
import { HeaderTwo, PageHeader } from '../../components/header'
import Page from '../../components/page'
import Section from '../../components/section'
import { SPA_ROUTES } from '../../route-paths'

const EventsCalendar = () => {
  return (
    <Page title="Events - Philly Mah-Jawn Mahjong Club">
      <Section>
        <ConstrainedDiv>
          <Card
            classNames={{ base: 'bg-transparent border-none' }}
            radius="none"
            shadow="none"
            fullWidth
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <PageHeader
                id="js-content-section-event-calendar"
                className="js-toc-section"
                text="Event Calendar"
              />
            </CardHeader>
            <CardBody className="overflow-visible py-2 flex flex-col items-center">
              <div className="w-full mt-8">
                <iframe
                  src="https://calendar.google.com/calendar/embed?wkst=1&ctz=America%2FNew_York&showPrint=0&src=Nzc2NmEwMjY3NTkwOGVjNDgxMmZmMjBiOGNlMzQ4NDM2MDhjYmIyZmY4M2ZjZDZlZDIxNTBjMmYwZTA1MTNjNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=c3RzbWpqM2R0bWQ3dGdpOG84ZGVrNnJ0Zm1taTV0dDNAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23795548&color=%23ad1457"
                  style={{ border: 0 }}
                  className="rounded-lg shadow-sm w-[90%] mx-auto h-[400px] md:h-[600px]"
                />
              </div>
            </CardBody>
          </Card>
        </ConstrainedDiv>
      </Section>

      <Section>
        <ConstrainedDiv>
          <Card
            classNames={{ base: 'bg-transparent border-none' }}
            radius="none"
            shadow="none"
            fullWidth
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <PageHeader
                id="js-content-section-event-calendar"
                className="js-toc-section"
                text="Other Events"
              />
            </CardHeader>
            <CardBody className="overflow-visible py-2 flex flex-col items-center">
              <div className="w-full mt-6">
                <Link href={SPA_ROUTES.EVENTS_PRO2025}>
                  <HeaderTwo text="Philadelphia Riichi Open 2025" />
                </Link>
              </div>
              <div className="w-full mt-6">
                <Link href={SPA_ROUTES.EVENTS_PRO2024}>
                  <HeaderTwo text="Philadelphia Riichi Open 2024" />
                </Link>
              </div>
            </CardBody>
          </Card>
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default EventsCalendar
