import { Link } from 'wouter'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { PageHeader, HeaderTwo, HeaderThree } from '../components/header'
import Page from '../components/page'
import { Card, CardHeader, CardBody, Image, Divider, Button } from '@heroui/react'
import Section from '../components/section'
import ConstrainedDiv from '../components/constrained-div'
import { SPA_ROUTES } from '../route-paths'
import { Fragment, useEffect, useState } from 'react'
import tocbot from 'tocbot'
import JawnsouMeetupImg from '../../src/assets/IMG_8592.jpg'
import KopMeetupImg from '../../src/assets/IMG_8530.jpg'
import MembershipImg from '../../src/assets/IMG_1999.jpg'
import LearningImg from '../../src/assets/IMG_8802.jpg'
import CompetitivePlayImg from '../../src/assets/IMG_1939.jpg'
import JoinUsTodayImg from '../../src/assets/IMG_8765.jpg'

type MeetupCardProps = {
  title: string
  description: string
  times: string[]
  href: string
  img?: string
}

const MeetupCard = ({ title, description, times, href, img }: MeetupCardProps) => (
  <>
    <div className="flex-1 w-full">
      <Card
        shadow="none"
        fullWidth
        classNames={{
          base: 'bg-transparent border-none'
        }}
      >
        <Link href={href}>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <HeaderTwo text={title} />
            <p className="text-copy-secondary text-lg">{description}</p>
            <p className="mt-2 self-center text-copy-secondary text-lg">
              {times.map((time, index) => (
                <Fragment key={`${title}-${index}`}>
                  {time}
                  <br />
                </Fragment>
              ))}
            </p>
            <p className="mt-auto text-xl text-link-secondary flex items-center">
              Learn More <ArrowLongRightIcon className="size-5 pt-1 ml-1" />
            </p>
          </CardHeader>
        </Link>
      </Card>
    </div>
    {img && (
      <div className="flex-shrink-0">
        <Image alt="Card background" className="object-cover rounded-xl" src={img} width={400} />
      </div>
    )}
  </>
)

const Index = () => {
  const [isTocOpen, setIsTocOpen] = useState(false)
  // configure toc
  useEffect(() => {
    tocbot.init({
      tocSelector: '.js-toc',
      contentSelector: '.js-toc-content',
      headingSelector: '.js-toc-section',
      headingsOffset: 80,
      scrollSmoothOffset: -80
    })
    return () => tocbot.destroy()
  }, [])

  return (
    <>
      <div
        className={`
    fixed bottom-0 left-0 right-0 w-full z-50 
    bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]
    transition-all duration-300 ease-in-out
    ${isTocOpen ? 'h-auto pb-8' : 'h-14 pb-0'} 
    lg:h-auto lg:fixed lg:bottom-auto lg:left-auto lg:right-8 lg:top-5/6 lg:-translate-y-1/2 lg:w-60 lg:rounded-2xl lg:border lg:p-4 lg:shadow-xl
  `}
      >
        <div
          className="flex items-center justify-between h-14 px-6 cursor-pointer lg:cursor-default lg:h-auto lg:px-2 lg:mb-3"
          onClick={() => window.innerWidth < 1024 && setIsTocOpen(!isTocOpen)}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            Table of Contents
            <span
              className={`text-[10px] transition-transform lg:hidden ${isTocOpen ? 'rotate-180' : ''}`}
            >
              ▼
            </span>
          </p>

          <div className="flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-xs font-bold text-red-600 px-2 py-1 border border-red-100 rounded-md"
            >
              ↑ TOP
            </button>
          </div>
        </div>

        <nav
          className={`
      js-toc px-6 overflow-y-auto transition-opacity duration-200
      ${isTocOpen ? 'max-h-[40vh] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}
      lg:px-0
    `}
          onClick={() => setIsTocOpen(false)}
        ></nav>
      </div>

      <Page title="Philly Mah-Jawn Mahjong Club" footerClassName="pb-16 md:pb-0">
        <div className="js-toc-content w-full">
          {/* Welcom Section */}
          <Section>
            <ConstrainedDiv>
              <Card
                classNames={{ base: 'bg-transparent border-none' }}
                radius="none"
                shadow="none"
                fullWidth
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <PageHeader text="Welcome!" />
                </CardHeader>

                {/* Banner, set the "hidden={false}" attribute to show*/}
                <CardBody className="overflow-visible py-2 flex flex-col bg-warning" hidden={true}>
                  <HeaderThree text="Announcement" />
                  <b>Upcoming Closure</b>
                  <br />
                  <br />
                  We are closed the entire weekend of{' '}
                  <b>Friday, Saturday and Sunday, Feb 20 - 22</b> for the Saikouisen Professional
                  Mahjong Pro Exam.
                  <br />
                  <br />
                  Sorry for the inconvenience, we will be returning to normal hours the following
                  week.
                  <br />
                  <br />
                  Please join our Discord for the most up to date information!
                </CardBody>

                <CardBody className="overflow-visible py-2 flex flex-col items-center">
                  <div>
                    <p className="text-copy-secondary text-lg">
                      We are a Japanese (Riichi) Mahjong club based out of Philadelphia (Old City)
                      as well as in King of Prussia. Originally founded in 2019, we played Mahjong
                      in various establishments until we opened up our own space (The Mah-Jawn
                      Clubhouse) in Old City in March 2025.
                    </p>
                    <p className="text-copy-secondary text-lg mt-3">
                      We meet weekly to play, compete, as well as teach newcomers! If you wanted to
                      learn the Japanese version of the game, wanted to join our members for pickup
                      games, or if you had your own group of players and wanted to rent one of our
                      automatic Mahjong tables, click the links in the table of contents below or
                      scroll on to learn more!
                    </p>
                  </div>
                </CardBody>
              </Card>
            </ConstrainedDiv>
          </Section>
          {/* Meetup Section */}
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
                    id="js-content-section-weekly-meetups"
                    className="js-toc-section"
                    text="Weekly Meetups"
                  />
                </CardHeader>

                <CardBody className="overflow-visible py-2 flex flex-col md:flex-row gap-6 items-center">
                  <MeetupCard
                    title="Meetups in Old City, Philadelphia"
                    description=" Meetings on Friday, Saturday and Sunday at our new Mahjong Clubhouse located right in Old City in Philadelphia."
                    times={[
                      'Friday: 7:00 pm - 11:00 pm',
                      'Saturday: 12:00 pm - 8:00 pm',
                      'Sunday: 2:00 pm - 8:00 pm'
                    ]}
                    href={SPA_ROUTES.OLD_CITY}
                    img={JawnsouMeetupImg}
                  />
                </CardBody>

                <Divider />

                <CardBody className="overflow-visible py-2 flex flex-col md:flex-row gap-6 items-center">
                  <MeetupCard
                    title="Meetups in King of Prussia"
                    description="Meetings on Wednesday evenings at the King of Prussia Bridge Club."
                    times={['Wednesday: 6:30 pm - 10:00 pm']}
                    href={SPA_ROUTES.KOP}
                    img={KopMeetupImg}
                  />
                </CardBody>
              </Card>
            </ConstrainedDiv>
          </Section>

          {/* Membership Section */}
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
                    id="js-content-section-membership"
                    className="js-toc-section"
                    text="Membership"
                  />
                </CardHeader>

                <CardBody className="overflow-visible py-2 flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0">
                    <Image className="object-cover rounded-xl" src={MembershipImg} width={400} />
                  </div>

                  <div className="flex-1 w-full">
                    <p className="text-copy-secondary text-lg">
                      You can help support our club by signing up for a membership! A membership is
                      required to participate in meetups at our Old City Clubhouse. (Membership is
                      not required for our King of Prussia meetups) We offer 2 tiers of memberships:
                    </p>

                    <HeaderTwo text="Tanyao" />
                    <p className="text-copy-secondary text-lg">$20/calendar year.</p>
                    <p className="text-copy-secondary text-lg">
                      Allows access to the Clubhouse and autotable/equipment reservations.
                    </p>

                    <HeaderTwo text="Mangan" />
                    <p className="text-copy-secondary text-lg">$60/calendar year.</p>
                    <p className="text-copy-secondary text-lg">
                      All Tanyao membership benefits, stamp card program (every tenth visit is
                      free!), invites to monthly membership events/tournaments, and more!
                    </p>
                    <p className="mt-2 self-center text-copy-secondary text-lg">
                      Purchasing a new membership will waive the venue fee for that day. <br />
                    </p>
                  </div>
                </CardBody>
              </Card>
            </ConstrainedDiv>
          </Section>

          {/* Learning Section */}
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
                    id="js-content-section-learning"
                    className="js-toc-section"
                    text="Learning"
                  />
                </CardHeader>

                <CardBody className="overflow-visible py-2 flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 w-full">
                    <p className="text-copy-secondary text-lg">
                      On Saturdays, from 12:00pm - 2:00pm, we offer Mahjong lessons at no extra cost
                      outside of the venue fee. Whether you're brand new to Mahjong, or played a
                      different version and wanted to learn the Japanese version, we offer a
                      structured teaching regimen intended to get you able to enjoy the full aspects
                      of the game.
                    </p>

                    <p className="text-copy-secondary text-lg mt-3">
                      The general timeline of our teaching is as follows:
                    </p>
                    <ul className="list-disc list-outside ml-10 space-y-2">
                      {[
                        'Learn the tiles',
                        'Experience the gameplay with learning play order, claiming tiles, and creating winning hands',
                        "Learn the various 'Yaku' (Winning conditions)"
                      ].map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>

                    <p className="text-copy-secondary text-lg mt-3">
                      Once you're comfortable with the basics, you can join other members for
                      regular games. Advanced topics such as defensive play and scoring can be
                      taught upon request!
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Image className="object-cover rounded-xl" src={LearningImg} width={400} />
                  </div>
                </CardBody>
              </Card>
            </ConstrainedDiv>
          </Section>

          {/* Competitive Play Section */}
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
                    id="js-content-section-competitive-play"
                    className="js-toc-section"
                    text="Competitive Play"
                  />
                </CardHeader>

                <CardBody className="overflow-visible py-2 flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="object-cover rounded-xl"
                      src={CompetitivePlayImg}
                      width={400}
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <p className="text-copy-secondary text-lg">
                      For experienced players who are comfortable with the basics of Mahjong we have
                      multiple opportunities for structured play.
                    </p>

                    <HeaderTwo text="PhiLeague" className="mt-3" />
                    <p className="text-copy-secondary text-lg">
                      During our meetups, you can participate in our league games. These are timed
                      games after which we record the scores on our database. Every quarter, the top
                      four players compete in a play-off to crown the champion. Overall these are
                      still friendly games and a great way to improve or add a little more
                      excitement to normal play. Click the link below to see our current player
                      rankings!
                    </p>
                    <Link href={SPA_ROUTES.LEAGUE}>
                      <p className="mt-auto text-xl text-link-secondary flex items-center">
                        View League <ArrowLongRightIcon className="size-5 pt-1 ml-1" />
                      </p>
                    </Link>

                    <HeaderTwo text="Monthly Mangan Events" className="mt-3" />
                    <p className="text-copy-secondary text-lg">
                      Every month we will have events for our Mangan Members. These events will
                      sometimes be tournament practice events, or times we play with silly rules to
                      shake things up!
                    </p>

                    <HeaderTwo text="Tournaments" className="mt-3" />
                    <p className="text-copy-secondary text-lg">
                      In the US, there are many tournaments held throughout the year. Our members
                      will regularly travel to other cities to play in these tournaments. If you're
                      interested in participating, check out the Event Calendar below to see the
                      upcoming tournaments or check out the Discord for more information.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </ConstrainedDiv>
          </Section>

          {/* Event Calendar Section */}
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

          {/* Join Us Today Section */}
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
                    id="js-content-section-join-us-today"
                    className="js-toc-section"
                    text="Join Us Today!"
                  />
                </CardHeader>
                <CardBody className="overflow-visible py-2 flex flex-col items-center">
                  <div className="w-[100%] md:w-[60%] mx-auto rounded-xl overflow-hidden">
                    <Image className="object-cover w-full" src={JoinUsTodayImg} />
                  </div>
                  <div className="mt-3 flex gap-4 justify-center">
                    <Button
                      as={Link}
                      href={SPA_ROUTES.GALLERY}
                      size="lg"
                      className="bg-copy-brand-primary font-semibold text-background-primary"
                    >
                      Club Photos
                    </Button>

                    <Button
                      as={Link}
                      size="lg"
                      href={SPA_ROUTES.CONTACT_US}
                      className="bg-copy-brand-primary font-semibold text-background-primary"
                    >
                      Contact Us
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </ConstrainedDiv>
          </Section>
        </div>
      </Page>
    </>
  )
}

export default Index
