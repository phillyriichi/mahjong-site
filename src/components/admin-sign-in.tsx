import { Button, DateRangePicker, Divider, Input } from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { Form } from '@heroui/form'
import ActivityLogsTable from './activity-logs-table'
import { useLocalStorage } from 'usehooks-ts'
import ActivityLogsStats from './activity-logs-stats'
import {
  AdminOpType,
  alertWithToast,
  LocationType,
  PaymentType,
  resolveMembership,
  resolvePriceFromSchema,
  signInPlayer,
  useMembershipTiers,
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
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const AdminSignIn = () => {
  const queryClient = useQueryClient()
  const [actionCount, setActionCount] = useState<number>(0)
  const [dateRange, setDateRange] = useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone())
  })
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

  const { data: availableMembershipTiers, isPending: isAvailableMembershipTiersPending } =
    useMembershipTiers()

  const [selectedMembershipOperation, setSelectedMembershipOperation] = useLocalStorage<
    string | null
  >('admin-signin-membership-operation', null)

  const resolvedPrice = useMemo(() => {
    if (isAvailableMembershipTiersPending) {
      return null
    }
    if (selectedPayment == PaymentType.VOUCHER || selectedPayment == PaymentType.WAIVED) {
      return 0
    }
    if (selectedAdminOp == AdminOpType.SIGN_IN) {
      const key = selectedLocation == LocationType.KOP ? 'SINGLE_VISIT_KOP' : 'SINGLE_VISIT'
      return resolvePriceFromSchema(availableMembershipTiers[key]?.priceSchema ?? [])
    } else if (selectedAdminOp == AdminOpType.MEMBERSHIP) {
      return resolvePriceFromSchema(
        availableMembershipTiers[selectedMembershipOperation!]?.priceSchema ?? []
      )
    } else if (selectedAdminOp == AdminOpType.FIRST_TIME_VISIT) {
      if (selectedMembershipOperation == 'SINGLE_VISIT') {
        const key = selectedLocation == LocationType.KOP ? 'SINGLE_VISIT_KOP' : 'SINGLE_VISIT'
        return resolvePriceFromSchema(availableMembershipTiers[key]?.priceSchema ?? [])
      } else {
        return resolvePriceFromSchema(
          availableMembershipTiers[selectedMembershipOperation!]?.priceSchema ?? []
        )
      }
    }
    return 0
  }, [
    availableMembershipTiers,
    selectedAdminOp,
    selectedLocation,
    selectedPayment,
    selectedMembershipOperation
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedAdminOp) {
      alertWithToast('warning', `Invalid Operation ${selectedAdminOp}`)
      return
    }
    if (!selectedPayment) {
      alertWithToast('warning', `Invalid Payment ${selectedPayment}`)
      return
    }
    if (resolvedPrice == null) {
      alertWithToast('warning', `Cannot Resolve Price ${resolvedPrice}`)
      return
    }
    if (selectedAdminOp == AdminOpType.SIGN_IN) {
      if (!selectedLocation) {
        alertWithToast('warning', `Invalid Location ${selectedLocation}`)
        return
      }
      if (!selectedPlayer) {
        alertWithToast('warning', `Invalid Player ${selectedPlayer}`)
        return
      }
      const activeMembership = resolveMembership(selectedPlayer)
      const x = signInPlayer(
        selectedPlayer,
        activeMembership.type,
        selectedPayment,
        selectedLocation,
        resolvedPrice,
        selectedQueue
      )
      alertWithToast('success', '')
      setActionCount((prev) => prev + 1)
    } else if (selectedAdminOp == AdminOpType.MEMBERSHIP) {
      if (!selectedPlayer) {
        alertWithToast('warning', `Invalid Player ${selectedPlayer}`)
        return
      }
      if (!selectedMembershipOperation) {
        alertWithToast('warning', `Invalid Membership ${selectedMembershipOperation}`)
        return
      }
    } else if (selectedAdminOp == AdminOpType.FIRST_TIME_VISIT) {
    }
  }

  useEffect(() => {
    setSelectedMembershipOperation(null)
  }, [selectedAdminOp])

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
                  showActiveMembership={true}
                  showSigninStatus={true}
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

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
            <span className="text-sm font-medium md:min-w-[100px]">Cost (Fee Excluded)</span>
            <span>{resolvedPrice}</span>
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
              setDateRange({
                start: val.start,
                end: val.end
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
        <ActivityLogsTable
          start={dateRange.start}
          end={dateRange.end}
          actionCount={actionCount}
          setActionCount={setActionCount}
        />
      </div>
    </div>
  )
}

export default AdminSignIn
