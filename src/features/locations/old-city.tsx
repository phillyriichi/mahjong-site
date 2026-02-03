import ConstrainedDiv from '../../components/constrained-div'
import { HeaderThree, PageHeader } from '../../components/header'
import Page from '../../components/page'
import Section from '../../components/section'

const OldCity = () => {
  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <Section>
        <PageHeader text="Mahjong Clubhouse in Old City, Philadelphia" />
      </Section>
      <Section>
        <ConstrainedDiv className="flex flex-col gap-6">
          <HeaderThree text="Cost" />
          <p>The venue fee is $10 for the day.</p>
          <p>
            We offer a special introductory period on Saturdays from 12:00 pm - 2:00 pm where you
            can access the venue to try it out, play some Mahjong, and even receive a free lesson
            from our talented staff for no extra cost!
          </p>
          <p>
            We have a membership program which allows members to utilize the space outside the
            introductory period.
          </p>
          <p>There are 2 tiers of membership available:</p>
          <ul>
            <li>
              <b>- Tanyao:</b> $20/calendar year. Allows access to the club and table reservations.
            </li>
            <li>
              <b>- Mangan:</b> $60/calendar year. All Tanyao membership benefits, stamp card program
              (every tenth visit is free!), invites to monthly membership, and more!
            </li>
          </ul>
          <p>Purchasing a new membership will waive the venue fee for that day!</p>
          <p>
            If you have a group of 4, feel free to contact us if you are interested in reserving a
            table ahead of time. If coming solo, you can check out our Discord server (link below)
            to confirm with other players ahead of time for games.
          </p>
          <p>
            While we are a Japanese Mahjong club, our clubhouse can support multiple types of
            Mahjong (Chinese, American, etc). If you have a group of 4 and want to have a table
            configured for a specific type of Mahjong, let us know ahead of time and we will be
            happy to set up a table for you!
          </p>
        </ConstrainedDiv>
      </Section>
      <Section>
        <ConstrainedDiv>
          <HeaderThree text="Hours" />
          <div className="border-t-2 border-b-1 border-border-primary py-2 flex mt-6">
            <p className="basis-sm">Friday</p>
            <p>7:00 pm - 11:00 pm</p>
          </div>
          <div className="border-t-1 border-b-1 border-border-primary py-2 flex">
            <p className="basis-sm">Saturday</p>
            <p>12:00 pm - 8:00 pm</p>
          </div>
          <div className="border-t-1 border-b-2 border-border-primary py-2 flex">
            <p className="basis-sm">Sunday</p>
            <p>2:00 pm - 8:00 pm</p>
          </div>
        </ConstrainedDiv>
      </Section>
      <Section>
        <ConstrainedDiv>
          <HeaderThree text="Location and Access" />
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center min-h-[450px]">
            <div className="basis-1/3">
              <p>
                The clubhouse is located at 123 Chestnut St. Philadelphia, PA 19106. The entrance is
                on 2nd St.
              </p>
              <p className="mt-4">
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
