import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@heroui/react'
import ConstrainedDiv from '../../components/constrained-div'
import { HeaderTwo, PageHeader } from '../../components/header'
import Page from '../../components/page'
import Section from '../../components/section'

const Kop = () => {
  const kopHours = [{ day: 'Wednesday', hours: '6:30 pm - 10:00 pm' }]
  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <Section>
        <PageHeader text="Mahjong at the King of Prussia Bridge Club" />
      </Section>
      <Section>
        <ConstrainedDiv className="flex flex-col gap-6">
          <HeaderTwo text="Cost" />
          <p className="text-copy-secondary text-lg">The venue fee is $5.</p>
          <p className="text-copy-secondary text-lg">
            Membership is not required. Games are played on hand shuffle sets (no autotables).
          </p>
          <p className="text-copy-secondary text-lg">
            Players of all skill levels are welcome. We are more than happy to teach new players!
          </p>

          <p className="text-copy-secondary text-lg">
            Please
            <Button
              as="a"
              size="sm"
              href="https://www.meetup.com/phillymahjawn/"
              target="_blank"
              className="ml-2 bg-copy-brand-primary font-semibold text-background-secondary"
            >
              RSVP via MeetUp
            </Button>
          </p>
        </ConstrainedDiv>
      </Section>
      <Section>
        <ConstrainedDiv>
          <HeaderTwo text="Hours" />
          <Table
            hideHeader
            removeWrapper
            className="mt-2"
            classNames={{
              td: 'border-t-2 border-b-2 border-divider border-red-700'
            }}
          >
            <TableHeader>
              <TableColumn key="day"> Day </TableColumn>
              <TableColumn key="hours"> Hours </TableColumn>
            </TableHeader>
            <TableBody items={kopHours}>
              {(item) => (
                <TableRow key={item.day}>
                  <TableCell> {item.day} </TableCell>
                  <TableCell> {item.hours} </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ConstrainedDiv>
      </Section>
      <Section>
        <ConstrainedDiv>
          <HeaderTwo text="Location and Access" />
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center min-h-[450px]">
            <div className="basis-1/3">
              <p className="text-copy-secondary text-lg">
                The King of Prussia Bridge Club is located at 215 W Church Rd #100, King of Prussia,
                PA 19406.
              </p>
              <p className="text-copy-secondary text-lg mt-4">
                You can enter from the back of the main building, and the entrance to the club is on
                the right.
              </p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1815.104976086687!2d-75.35978986611947!3d40.08365267117873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c69594241a1f9d%3A0x4c5b5367e4b27fac!2sKing%20of%20Prussia%20Bridge%20Club!5e0!3m2!1sen!2sus!4v1751167159589!5m2!1sen!2sus"
              className="flex-1 h-[450px] md:w-[600px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default Kop
