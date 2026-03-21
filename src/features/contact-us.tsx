import { useState } from 'react'
import { alertWithToast, sendContactEmail } from '../components/backend-manager'
import ConstrainedDiv from '../components/constrained-div'
import { HeaderTwo, PageHeader, Paragraph } from '../components/header'
import Page from '../components/page'
import Section from '../components/section'
import { Button } from '@heroui/button'
import { Input, Textarea, Card, CardBody, Link as HeroUILink } from '@heroui/react'

const ContactUs = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Page title="Contact Us - Philly Mah-Jawn Mahjong Club">
      <Section>
        <ConstrainedDiv className="flex flex-col gap-2 items-center">
          <PageHeader text="Contact Us" />
          <Paragraph>
            Most of our activity and planning is done via <b>Discord</b>. You can join our server by
            clicking the button below.
          </Paragraph>

          <Button
            as="a"
            size="lg"
            href="https://discord.gg/YAsRETMryS"
            target="_blank"
            className="bg-copy-brand-primary font-semibold text-background-primary"
          >
            Discord
          </Button>
          <Paragraph>
            To reach out to us via email, you can fill out the form below, or email us directly at{' '}
            <HeroUILink href="mailto:phillyriichi@gmail.com">phillyriichi@gmail.com</HeroUILink>.
          </Paragraph>

          <Paragraph>You can also message us via Facebook or Instagram!</Paragraph>
        </ConstrainedDiv>

        <div className="flex justify-center p-4 mt-3">
          <Card className="w-full max-w-[600px]">
            <CardBody className="gap-4">
              <HeaderTwo text="Email Form" className="text-center" />

              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  // prevent default behavior of refreshing the page.
                  e.preventDefault()
                  setIsSubmitting(true)
                  const rst = await sendContactEmail(name, email, message)
                  if (rst.success) {
                    alertWithToast('success', 'Submitted')
                    setName('')
                    setEmail('')
                    setMessage('')
                  } else {
                    alertWithToast('warning', rst.message, 'Warning')
                  }
                  setIsSubmitting(false)
                }}
              >
                <Input
                  isRequired
                  type="text"
                  label="Name"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onValueChange={setName}
                />

                <Input
                  isRequired
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onValueChange={setEmail}
                />

                <Textarea
                  isRequired
                  label="Message"
                  placeholder="Enter your message"
                  name="message"
                  value={message}
                  onValueChange={setMessage}
                />

                <Button
                  type="submit"
                  className="bg-copy-brand-primary font-semibold text-background-primary mt-2"
                  isLoading={isSubmitting}
                >
                  Send
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </Section>
    </Page>
  )
}

export default ContactUs
