import { Button, Image } from '@heroui/react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { Link as HeroUILink } from '@heroui/link'
import ConstrainedDiv from '../../components/constrained-div'
import Page from '../../components/page'
import Section from '../../components/section'
import Pro2025Img from '../../../src/assets/pro2025_banner.png'
import { Header, HeaderTwo, Paragraph } from '../../components/header'

const Pro2025 = () => {
  const tournamentDiscordLink = 'https://discord.gg/wEufVSPJs7'
  const fullTournamentSchedule = [
    {
      date: 'Saturday November 8',
      schedule: [
        { time: '9:00 AM', event: 'Registration' },
        { time: '9:45 AM', event: 'Introductions' },
        { time: '10:00 AM', event: 'Hanchan 1' },
        { time: '11:45 AM', event: 'Hanchan 2' },
        { time: '1:15 PM', event: 'Lunch' },
        { time: '2:30 PM', event: 'Hanchan 3' },
        { time: '4:15 PM', event: 'Hanchan 4' },
        { time: '6:00 PM', event: 'Hanchan 5' },
        { time: '7:30 PM', event: 'Free Play (At Clubhouse)' }
      ]
    },
    {
      date: 'Sunday November 9',
      schedule: [
        { time: '9:00 AM', event: 'Registration' },
        { time: '9:45 AM', event: 'Introductions' },
        { time: '10:00 AM', event: 'Hanchan 6' },
        { time: '11:45 AM', event: 'Hanchan 7' },
        { time: '1:15 PM', event: 'Lunch' },
        { time: '2:30 PM', event: 'Hanchan 8' },
        { time: '4:15 PM', event: 'Hanchan 9' },
        { time: '6:00 PM', event: 'Closing Ceremony' },
        { time: '6:30 PM', event: 'Free Play Begins' }
      ]
    }
  ]
  const maxRows = Math.max(...fullTournamentSchedule.map((d) => d.schedule.length))

  return (
    <Page title="PRO2025 - Philly Mah-Jawn Mahjong Club">
      <Section>
        <ConstrainedDiv>
          <div className="flex justify-center mb-8">
            <Image className="object-cover rounded-xl w-full" src={Pro2025Img} width={1400} />
          </div>

          <div className="w-full">
            <Header text="General Info" />
            <Paragraph
              textlines={[
                'We happy to announce the second annual Riichi Open tournament in the greater Philadelphia area!',
                'It will be held this year at the the Old Pine Community Center, located in historic Old City Philadelphia, and nearby to the Philly Mah-Jawn Clubhouse where Free Play will be held.',
                'Tournament entry includes Free Play and 2025 Tanyao membership at the Philly Mah-Jawn Clubhouse!',
                'As the space at the Clubhouse is smaller, table space at Free Play will be available on a first-come first-served basis.'
              ]}
            />

            <HeaderTwo text="Tournament Dates" />
            <Paragraph
              textlines={[
                'November 8 - 9 (Saturday and Sunday)',
                '(Free play will be available on Thursday, Friday and Monday as well!)'
              ]}
            />

            <HeaderTwo text="Location" />
            <Paragraph>
              <p>Old Pine Community Center</p>
              <p>
                401 Lombard St, Philadelphia PA 19147 (
                <HeroUILink href="https://maps.app.goo.gl/9AvKVrgJ4rx7jQM49">Map Link</HeroUILink>)
              </p>
              <p className="mt-2">
                Free play will be held at the Philly Mah-Jawn Clubhouse (123 Chestnut St Suite 204A
                - <HeroUILink href="https://maps.app.goo.gl/Qg1SHfhDxKZXqbue6">Map Link</HeroUILink>
                )
              </p>
            </Paragraph>

            <HeaderTwo text="Entry Fee" />
            <Paragraph
              textlines={[
                '$70 (Any current Mangan Members will receive a clubhouse voucher for signing up!)'
              ]}
            />

            <HeaderTwo text="Player Cap" />
            <Paragraph textlines={['80 players']} />

            <HeaderTwo text="Food" />
            <Paragraph
              textlines={[
                'Water and Coffee will be provided at no extra cost. Food will not be provided at the venue, but there are a large number of food options within walking distance of the venue.'
              ]}
            />
          </div>

          <div className="w-full">
            <Header text="Registration" />
            <Paragraph>
              <p>
                PRO2025 is full! We have a wait list available and any spots that open up will be
                filled from the{' '}
                <HeroUILink href="https://forms.gle/YzrTiXwJqzEVt5hY7">wait list</HeroUILink> in
                order.
              </p>
            </Paragraph>
          </div>

          <div className="w-full">
            <Header text="Tournament Info" />

            <HeaderTwo text="Ruleset" />
            <Paragraph>
              The tournament uses{' '}
              <HeroUILink href="https://www.worldriichi.org/wrc-rules">WRC 2025 ruleset</HeroUILink>{' '}
              with following modifiers:
              <ul>
                <li key="red5">- Red Fives</li>
                <li key="uma">- 30/10 Uma</li>
                <li key="nagashi">- Nagashi Mangan</li>
              </ul>
            </Paragraph>

            <HeaderTwo text="Timers" />
            <Paragraph
              textlines={[
                'Games will be 75 minutes + 0 hands. When time is called, any tables not completed will finish their current hand. No additional hands will be played.'
              ]}
            />

            <HeaderTwo text="Format" />
            <Paragraph
              textlines={[
                'This tournament will be a fully cumulative 9 Hanchan format, with final placement decided by total score at the end of the 9th Hanchan.'
              ]}
            />

            <HeaderTwo text="Prizes" />
            <Paragraph textlines={['To be announced!']} />

            <HeaderTwo text="Scheudle" />
            <Paragraph
              textlines={['Free Play will also be available Thursday, Friday, and Monday.']}
            />
            <Table
              aria-label="Compact Tournament Schedule"
              isStriped
              shadow="none"
              classNames={{
                base: 'border border-divider rounded-xl',
                th: 'bg-default-100 text-default-700 h-12 text-xs sm:text-sm font-bold px-2 sm:px-4',
                td: 'py-2 px-2 sm:px-4'
              }}
            >
              <TableHeader>
                {fullTournamentSchedule.map((day, index) => (
                  <TableColumn key={index}>{day.date}</TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {Array.from({ length: maxRows }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {fullTournamentSchedule.map((day, colIndex) => {
                      const item = day.schedule[rowIndex]
                      return (
                        <TableCell key={colIndex}>
                          {item ? (
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="text-[10px] sm:text-xs font-mono font-bold text-primary uppercase">
                                {item.time}
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-copy-primary leading-tight">
                                {item.event}
                              </span>
                            </div>
                          ) : (
                            <div className="h-8" />
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="w-full">
            <Button
              as="a"
              size="sm"
              href={tournamentDiscordLink}
              target="_blank"
              className="bg-copy-brand-primary font-semibold text-background-primary my-4"
            >
              Tournament Discord
            </Button>

            <HeaderTwo text="Participants" />
            <iframe
              src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRzIEFykpVcx00YWn3d6dM4TOU_kclqRZ2qJGdRgWiVxvjDN7fWokGx5BpMbtBTWpBob113eZxOPloZ/pubhtml?single=true&amp;gid=0&amp;range=a1%3Ad101&amp;widget=false&amp;chrome=false"
              width="840px"
              height="600px"
              className="border-none w-full h-[600px] rounded-lg"
            ></iframe>
          </div>
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default Pro2025
