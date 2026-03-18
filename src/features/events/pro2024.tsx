import { Button, Image } from '@heroui/react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { Link as HeroUILink } from '@heroui/link'
import ConstrainedDiv from '../../components/constrained-div'
import Page from '../../components/page'
import Section from '../../components/section'
import Pro2024Img from '../../../src/assets/pro2024_banner.jpg'
import { Header, HeaderTwo, Paragraph } from '../../components/header'

const Pro2024 = () => {
  const tournamentDiscordLink = 'https://discord.gg/wEufVSPJs7'
  const fullTournamentSchedule = [
    {
      date: 'Saturday March 23',
      schedule: [
        { time: '9:00 AM', event: 'Registration' },
        { time: '9:45 AM', event: 'Introductions' },
        { time: '10:00 AM', event: 'Hanchan 1' },
        { time: '11:45 AM', event: 'Hanchan 2' },
        { time: '1:15 PM', event: 'Lunch' },
        { time: '3:00 PM', event: 'Hanchan 3' },
        { time: '4:45 PM', event: 'Hanchan 4' },
        { time: '6:30 PM', event: 'Free Play Begins' },
        { time: '11:00 PM', event: 'Venue Closes' }
      ]
    },
    {
      date: 'Sunday March 24',
      schedule: [
        { time: '9:00 AM', event: 'Registration' },
        { time: '9:45 AM', event: 'Introductions' },
        { time: '10:00 AM', event: 'Hanchan 5' },
        { time: '11:45 AM', event: 'Hanchan 6' },
        { time: '1:15 PM', event: 'Lunch' },
        { time: '3:00 PM', event: 'Hanchan 7' },
        { time: '4:45 PM', event: 'Hanchan 8' },
        { time: '6:45 PM', event: 'Closing Ceremonies' },
        { time: '7:00 PM', event: 'Free Play Begins' },
        { time: '10:00 PM', event: 'Venue Closes' }
      ]
    }
  ]

  const maxRows = Math.max(...fullTournamentSchedule.map((d) => d.schedule.length))

  return (
    <Page title="PRO2024 - Philly Mah-Jawn Mahjong Club">
      <Section>
        <ConstrainedDiv>
          <div className="flex justify-center mb-8">
            <Image className="object-cover rounded-xl w-full" src={Pro2024Img} width={1400} />
          </div>

          <div className="w-full">
            <Header text="General Info" />
            <Paragraph
              textlines={[
                'We are happy to be holding the first Riichi Open tournament in the greater Philadelphia area!',
                'With walking distance to great areas like Reading Terminal Market, Chinatown, and City Hall, the Convention Center provides a great central location for players from within Philadelphia and those visiting us from elsewhere.',
                'Hope to see you in Philadelphia!'
              ]}
            />

            <HeaderTwo text="Tournament Dates" />
            <Paragraph
              textlines={[
                'March 23 - 24 (Saturday and Sunday)',
                '(Free play will be available on Friday)'
              ]}
            />

            <HeaderTwo text="Location" />
            <Paragraph
              textlines={[
                'Pennsylvania Convention Center Room 125 (Enter from Broad Street Atrium)'
              ]}
            />

            <HeaderTwo text="Entry Fee" />
            <Paragraph textlines={['$65']} />

            <HeaderTwo text="Player Cap" />
            <Paragraph>
              <s>80 players</s> 100 players
            </Paragraph>

            <HeaderTwo text="Food" />
            <Paragraph
              textlines={[
                'Due to the large number of food options nearby, food will not be provided at the venue. Extra time will be allotted during the lunch breaks to accommodate this. Water and coffee will be provided.'
              ]}
            />
          </div>

          <div className="w-full">
            <Header text="Registration" />
            <Paragraph
              textlines={[
                'Registration is closed. Thank you for the interest and hope to see you at a future event!'
              ]}
            />
          </div>

          <div className="w-full">
            <Header text="Tournament Info" />

            <HeaderTwo text="Ruleset" />
            <Paragraph>
              The tournament uses{' '}
              <HeroUILink href="https://www.worldriichi.org/wrc-rules">WRC ruleset</HeroUILink> with
              following modifiers:
              <ul>
                <li key="red5">- Red Fives (Mod 2.1)</li>
                <li key="uma">- 30/10 Uma when playing with Red Fives</li>
                <li key="nagashi">- Nagashi Mangan (Mod 3.2)</li>
                <li key="penalty">- Lower Penalties (Mod 6.3)</li>
              </ul>
              This tournament has been approved as a NARMA Qualifier. See{' '}
              <HeroUILink href="https://www.nariichi.org/wrc-2025-qualification">here</HeroUILink>{' '}
              for details.
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
                'All players will play 8 hanchan with cumulative score. At the end of the 8th hanchan, placement will be determined by the final score rankings. There are no score cuts or resets.'
              ]}
            />

            <HeaderTwo text="Prizes" />
            <Paragraph
              textlines={['Top 4 players receive trophies. 5th through 8th receive medals.']}
            />

            <HeaderTwo text="Scheudle" />
            <Paragraph
              textlines={['Free Play will also be available Friday, March 22 from 2 PM - 11 PM']}
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
              src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR467x-ANHeGLu0V0txzCl48xGPNpZQ8_574ixDPCADsre_gIx2j0gbR9wkm_xjzaIU1LeF8_WNOjrT/pubhtml?single=true&amp;gid=0&amp;range=a1%3Ad101&amp;widget=false&amp;chrome=false"
              className="border-none w-full h-[600px] rounded-lg"
            ></iframe>

            <HeaderTwo text="Rankings" />
            <iframe
              src="https://docs.google.com/spreadsheets/u/2/d/1Q2e2NG2s3jW6NJdzS0fo3-e0I-098lCi82QYlkoBjgg/pubhtml?single=true&amp;gid=0&amp;range=u2:ac53&amp;widget=false&amp;chrome=false"
              className="border-none w-full h-[600px] rounded-lg"
            ></iframe>
          </div>
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default Pro2024
