import { Link } from 'wouter'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { PageHeader, HeaderTwo } from '../components/header'
import Page from '../components/page'
import Section from '../components/section'
import ConstrainedDiv from '../components/constrained-div'
import { SPA_ROUTES } from '../route-paths'

type MeetupCardProps = {
  title: string
  description: string
  times: string[]
  href: string
}

const MeetupCard = ({ title, description, times, href }: MeetupCardProps) => (
  <Link
    href={href}
    className="flex-1 rounded-md bg-background-secondary border-2 border-border-primary px-2 pb-2 group hover:saturate-80 cursor-pointer"
  >
    <div className="flex flex-col h-full text-left">
      <HeaderTwo text={title} />
      <p className="text-copy-secondary text-lg">{description}</p>
      <p className="mt-2 self-center text-copy-secondary text-lg">
        {times.map((time) => (
          <>
            {time}
            <br />
          </>
        ))}
      </p>
      <p className="mt-auto text-xl text-link-secondary flex items-center">
        Learn More <ArrowLongRightIcon className="size-5 pt-1 ml-1" />
      </p>
    </div>
  </Link>
)

const Index = () => {
  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <Section>
        <PageHeader text="Play Mahjong in Philadelphia" className="text-3xl" />
        <ConstrainedDiv className="flex flex-col md:flex-row gap-4 mt-8">
          <MeetupCard
            title="Meetups in Old City, Philadelphia"
            description="Meetings on Friday, Saturday and Sunday at our new Mahjong Clubhouse located right in Old City in Philadelphia."
            times={[
              'Friday: 7:00 pm - 11:00 pm',
              'Saturday: 12:00 pm - 8:00 pm',
              'Sunday: 2:00 pm - 8:00 pm'
            ]}
            href={SPA_ROUTES.OLD_CITY}
          />
          <MeetupCard
            title="Meetups in King of Prussia"
            description="Meetings on Wednesday evenings at the King of Prussia Bridge Club."
            times={['Wednesday: 6:30 pm - 10:00 pm']}
            href={SPA_ROUTES.KOP}
          />
        </ConstrainedDiv>
      </Section>
      <Section>
        <ConstrainedDiv>
          <PageHeader text="Learn the game" />
        </ConstrainedDiv>
      </Section>
      <Section>
        <ConstrainedDiv>
          <PageHeader text="Improve your play" />
        </ConstrainedDiv>
      </Section>
      <Section>
        <ConstrainedDiv>
          <PageHeader text="Have fun" />
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default Index
