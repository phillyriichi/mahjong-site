import { Card, CardBody, CardHeader } from '@heroui/react'
import ConstrainedDiv from '../components/constrained-div'
import { HeaderTwo, PageHeader } from '../components/header'
import Page from '../components/page'
import Section from '../components/section'

const Events = () => {
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
              <div className="w-full mt-8">
                <h3>TODO PRO 2025</h3>
                <h3>TODO PRO 2024</h3>
              </div>
            </CardBody>
          </Card>
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default Events
