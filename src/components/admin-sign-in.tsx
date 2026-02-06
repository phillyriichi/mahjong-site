import { Button, DateRangePicker, Divider, Input } from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { Form } from '@heroui/form'
import ActivityLogsTable from './activity-logs-table'
import { useLocalStorage } from 'usehooks-ts'
import ActivityLogsStats from './activity-logs-stats'
import {
  AdminOpType,
  type LocationType,
  type MembershipOperationType,
  type PaymentType,
  type PlayerObject,
  type QueueType
} from './backend-manager'
import LocationButtonGroup from './location-button-group'
import PaymentButtonGroup from './payment-button-group'
import QueueButtonGroup from './queue-button-group'
import MembershipOperationButtonGroup from './membership-operation-button-group'
import PlayerSelect from './player-select'
import DividerWithText from './divider-with-text'
import AdminOpButtonGroup from './admin-op-button-group'
import { useState } from 'react'

const AdminSignIn = () => {
  const [storedRange, setStoredRange] = useLocalStorage('activity-logs-date-range', {
    start: today(getLocalTimeZone()).toString(),
    end: today(getLocalTimeZone()).toString()
  })
  const dateRange = {
    start: parseDate(storedRange.start),
    end: parseDate(storedRange.end)
  }
  const [selectedPlayer, setSelectedPlayer] = useLocalStorage<PlayerObject | null>(
    'admin-signin-player',
    null
  )
  const [selectedLocation, setSelectedLocation] = useLocalStorage<LocationType | null>(
    'admin-signin-location',
    null
  )
  const [selectedPayment, setSelectedPayment] = useLocalStorage<PaymentType | null>(
    'admin-signin-payment',
    null
  )
  const [selectedQueue, setSelectedQueue] = useLocalStorage<QueueType | null>(
    'admin-signin-queue',
    null
  )
  const [selectedAdminOp, setSelectedAdminOp] = useLocalStorage<AdminOpType>(
    'admin-op',
    AdminOpType.SIGN_IN
  )
  const [selectedMembershipOperation, setSelectedMembershipOperation] =
    useLocalStorage<MembershipOperationType | null>('admin-signin-membership-operation', null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    console.log('>>> submitting')
    setSelectedPayment(null)
    setSelectedPlayer(null)
  }

  return (
    <div className="w-full">
      <Form
        className="flex gap-4 w-full"
        key="player-update-input-form"
        onSubmit={async (e) => {
          // prevent default behavior of refreshing the page.
          e.preventDefault()
          setIsSubmitting(true)
          await handleSubmit()
          setIsSubmitting(false)
        }}
      >
        <div className="flex flex-col space-y-1 md:space-y-3 mt-4">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
            <span className="text-sm font-medium md:min-w-[100px]">Action</span>
            <AdminOpButtonGroup adminOp={selectedAdminOp} setAdminOp={setSelectedAdminOp} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
            <span className="text-sm font-medium md:min-w-[100px]">Location</span>
            <LocationButtonGroup location={selectedLocation} setLocation={setSelectedLocation} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
            <span className="text-sm font-medium md:min-w-[100px]">Payment</span>
            <PaymentButtonGroup payment={selectedPayment} setPayment={setSelectedPayment} />
          </div>

          {selectedAdminOp != AdminOpType.FIRST_TIME_VISIT ? (
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
              <span className="text-sm font-medium md:min-w-[100px]">Player</span>
              <div className="flex-1 max-w-sm">
                <PlayerSelect
                  selectedPlayer={selectedPlayer}
                  onSelectionChange={setSelectedPlayer}
                  label=""
                  variant="faded"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
                <span className="text-sm font-medium md:min-w-[100px]">Player Name</span>
                <div className="flex-1 max-w-sm">
                  <Input label="" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
                <span className="text-sm font-medium md:min-w-[100px]">Player Email</span>
                <div className="flex-1 max-w-sm">
                  <Input type="email" label="" />
                </div>
              </div>
            </>
          )}

          {(selectedAdminOp == AdminOpType.MEMBERSHIP ||
            selectedAdminOp == AdminOpType.FIRST_TIME_VISIT) && (
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
              <span className="text-sm font-medium md:min-w-[100px]">Membership</span>
              <MembershipOperationButtonGroup
                membershipOperation={selectedMembershipOperation}
                setMembershipOperation={setSelectedMembershipOperation}
                firstTimeVisit={selectedAdminOp == AdminOpType.FIRST_TIME_VISIT}
              />
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
            <span className="text-sm font-medium md:min-w-[100px]">Enqueue</span>
            <QueueButtonGroup
              queue={selectedQueue}
              setQueue={setSelectedQueue}
              allowUnselect={true}
            />
          </div>
        </div>
        <Button type="submit" color="primary" className="px-6 font-bold" isLoading={isSubmitting}>
          Submit
        </Button>
      </Form>

      <DividerWithText text={'Activity Stats and Logs'} className="flex items-center w-full my-3" />
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <DateRangePicker
          className="max-w-xs"
          label="Date Range"
          aria-label="Date Range"
          value={dateRange}
          onChange={(val) => {
            if (val) {
              setStoredRange({
                start: val.start.toString(),
                end: val.end.toString()
              })
            }
          }}
        />
      </div>
      <div className="w-full">
        <ActivityLogsStats start={dateRange.start} end={dateRange.end} />
      </div>
      <Divider className="my-3" />
      <div className="w-full overflow-x-auto">
        <ActivityLogsTable start={dateRange.start} end={dateRange.end} />
      </div>
    </div>
  )
}

export default AdminSignIn
