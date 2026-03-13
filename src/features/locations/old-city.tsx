import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import ConstrainedDiv from '../../components/constrained-div'
import { HeaderTwo, PageHeader } from '../../components/header'
import Page from '../../components/page'
import Section from '../../components/section'

const OldCity = () => {
  const jawnsouHours = [
    { day: 'Friday', hours: '7:00 pm - 11:00 pm' },
    { day: 'Saturday', hours: '12:00 pm - 8:00 pm' },
    { day: 'Sunday', hours: '2:00 pm - 8:00 pm' }
  ]
  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <Section>
        <PageHeader text="Mahjong Clubhouse in Old City, Philadelphia" />
      </Section>
      <Section>
        <ConstrainedDiv className="flex flex-col gap-6">
          <HeaderTwo text="Cost" />
          <p className="text-copy-secondary text-lg">The venue fee is $10 for the day.</p>
          <p className="text-copy-secondary text-lg">
            We offer a special introductory period on Saturdays from 12:00 pm - 2:00 pm where you
            can access the venue to try it out, play some Mahjong, and even receive a free lesson
            from our talented staff for no extra cost!
          </p>
          <p className="text-copy-secondary text-lg">
            We have a membership program which allows members to utilize the space outside the
            introductory period.
          </p>
          <p className="text-copy-secondary text-lg">There are 2 tiers of membership available:</p>
          <ul className="text-copy-secondary text-lg">
            <li>
              <b>- Tanyao:</b> $20/calendar year. Allows access to the club and table reservations.
            </li>
            <li>
              <b>- Mangan:</b> $60/calendar year. All Tanyao membership benefits, stamp card program
              (every tenth visit is free!), invites to monthly membership, and more!
            </li>
          </ul>
          <p className="text-copy-secondary text-lg">
            Purchasing a new membership will waive the venue fee for that day!
          </p>
          <p className="text-copy-secondary text-lg">
            If you have a group of 4, feel free to contact us if you are interested in reserving a
            table ahead of time. If coming solo, you can check out our Discord server (link below)
            to confirm with other players ahead of time for games.
          </p>
          <p className="text-copy-secondary text-lg">
            While we are a Japanese Mahjong club, our clubhouse can support multiple types of
            Mahjong (Chinese, American, etc). If you have a group of 4 and want to have a table
            configured for a specific type of Mahjong, let us know ahead of time and we will be
            happy to set up a table for you!
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
            <TableBody items={jawnsouHours}>
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
                The clubhouse is located at 123 Chestnut St. Philadelphia, PA 19106. The entrance is
                on 2nd St.
              </p>
              <p className="text-copy-secondary text-lg mt-4">
                If the door is locked, you can dial <b>{'#'}122</b> on the callbox to the left of
                the door to be let in during our open hours.
              </p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058.6763957016647!2d-75.14647732361561!3d39.948627583996114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c95b3789622f%3A0x9c42d132cc686dee!2sPhilly%20Mah-Jawn%20Mahjong%20Club!5e0!3m2!1sen!2sus!4v1751167190535!5m2!1sen!2sus"
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

export default OldCity
