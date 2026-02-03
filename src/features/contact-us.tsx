import ConstrainedDiv from '../components/constrained-div'
import { PageHeader } from '../components/header'
import Page from '../components/page'
import Section from '../components/section'

const ContactUs = () => {
  return (
    <Page title="Contact Us - Philly Mah-Jawn Mahjong Club">
      <Section>
        <ConstrainedDiv className="flex flex-col gap-2 items-center">
          <PageHeader text="Contact Us" />
          <p className="mt-4">
            Most of our activity and planning is done via <b>Discord</b>. You can join our server by
            clicking the button below.
          </p>
          {/* TODO: need to get the styling for this */}
          <a
            className="text-copy-brand-primary bg-background-brand-primary rounded-md text-lg font-bold px-4 py-2"
            href="https://discord.gg/YAsRETMryS"
            target="_blank"
          >
            Discord
          </a>
          <p>
            To reach out to us via email, you can fill out the form below, or email us directly at{' '}
            <b>
              <a href="mailto:phillyriichi@gmail.com">phillyriichi@gmail.com.</a>
            </b>
          </p>
          <p>You can also message us via Facebook or Instagram!</p>
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default ContactUs
