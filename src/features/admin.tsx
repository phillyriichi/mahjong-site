import { PageHeader } from '../components/header'
import Page from '../components/page'
import ConstrainedDiv from '../components/constrained-div'
import Section from '../components/section'
import LoginForm from '../components/login'
import { useLocalStorage } from 'usehooks-ts'

import { Tabs, Tab, Divider } from '@heroui/react'
import AdminPlayerProfile from '../components/admin-player-profile'
import AdminSignIn from '../components/admin-sign-in'
import AdminGameShuffle from '../components/admin-game-shuffle'
import AdminRulesets from '../components/admin-rulesets'
import { useAdminAuth } from '../components/useAdminAuth'

const Admin = () => {
  const [selectedTab, setSelectedTab] = useLocalStorage<string>('admin-selected-tab', 'sign-in-tab')
  const { isAdmin } = useAdminAuth()

  return (
    <>
      <Page title="Admin - Philly Mah-Jawn Mahjong Club">
        <Section>
          <ConstrainedDiv>
            <PageHeader text="Admin" />
            <Divider className="my-2" />
            {isAdmin ? (
              <div className="flex flex-col w-full">
                <Tabs
                  aria-label="admin-tabs"
                  variant="light"
                  classNames={{
                    base: 'overflow-x-auto scrollbar-hide w-full',
                    tabList: 'flex-nowrap w-full',
                    panel: 'flex justify-center w-full pt-10'
                  }}
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                >
                  <Tab key="sign-in-tab" title="Sign In">
                    <AdminSignIn />
                  </Tab>
                  <Tab key="game-shuffle-tab" title="Game Shuffle">
                    <AdminGameShuffle />
                  </Tab>
                  <Tab key="player-profile-tab" title="Player Profile">
                    <AdminPlayerProfile />
                  </Tab>
                  <Tab key="rulesets-tab" title="Rulesets">
                    {/* 这里的 div 会在 Tabs 下方独立一行并居中 */}
                    <div className="text-center">
                      <AdminRulesets />
                    </div>
                  </Tab>
                </Tabs>
                <Divider className="mt-2 mb-8" />
              </div>
            ) : (
              <></>
            )}
            <div className="flex">
              <div className="flex-1"></div>
              <LoginForm />
            </div>
          </ConstrainedDiv>
        </Section>
      </Page>
    </>
  )
}

export default Admin
