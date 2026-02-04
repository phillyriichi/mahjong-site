import { PageHeader } from '../components/header'
import Page from '../components/page'
import ConstrainedDiv from '../components/constrained-div'
import Section from '../components/section'
import LoginForm from '../components/login'

const Admin = () => {
  return (
    <Page title="Admin - Philly Mah-Jawn Mahjong Club">
      <Section>
        <ConstrainedDiv>
          <PageHeader text="Admin" />
          <LoginForm />
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default Admin
