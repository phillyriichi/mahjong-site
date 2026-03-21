import { Accordion, AccordionItem, Button, DateRangePicker, Divider, Input } from '@heroui/react'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Form } from '@heroui/form'
import ActivityLogsTable from './activity-logs-table'
import ActivityLogsStats from './activity-logs-stats'
import {
  addNewPlayer,
  AdminOpType,
  alertWithToast,
  LocationType,
  MembershipType,
  PaymentType,
  resolveMembership,
  resolvePriceFromSchema,
  signInPlayer,
  updatePlayerMembership,
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
import useConfirm from './confirm-modal'
import useLocalStorageWithTTL from './use-local-storage-with-ttl'
import MultiLineAccordion from './multi-line-accordion'

const AdminSignIn = () => {
  const queryClient = useQueryClient()
  const [actionCount, setActionCount] = useState<number>(0)
  const [dateRange, setDateRange] = useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone())
  })
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerObject | null>(null)
  const [newPlayerName, setNewPlyaerName] = useState<string>('')
  const [newPlayerEmail, setNewPlyaerEmail] = useState<string>('')
  const [newPlayerDiscordHandle, setNewPlyaerDiscordHandle] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useLocalStorageWithTTL<LocationType | null>(
    'admin-selcted-location',
    null
  )
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null)
  const [selectedQueue, setSelectedQueue] = useLocalStorageWithTTL<QueueType | null>(
    'admin-selected-queue',
    null
  )
  const [selectedAdminOp, setSelectedAdminOp] = useLocalStorageWithTTL<AdminOpType>(
    'admin-op',
    AdminOpType.SIGN_IN
  )
  const { ask, ConfirmModal } = useConfirm()

  const { data: availableMembershipTiers, isPending: isAvailableMembershipTiersPending } =
    useMembershipTiers()

  const [selectedMembershipOperation, setSelectedMembershipOperation] = useState<string | null>(
    null
  )

  const resolvedPrice = useMemo(() => {
    if (isAvailableMembershipTiersPending) {
      return null
    }
    if (selectedPayment == PaymentType.VOUCHER || selectedPayment == PaymentType.WAIVED) {
      return 0
    }
    if (!selectedLocation) {
      return null
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
    // general validations
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
      // handle sign-in operation
      if (!selectedLocation) {
        alertWithToast('warning', `Invalid Location ${selectedLocation}`)
        return
      }
      if (!selectedPlayer) {
        alertWithToast('warning', `Invalid Player ${selectedPlayer}`)
        return
      }
      const activeMembership = resolveMembership(selectedPlayer)
      if (activeMembership.type == MembershipType.NON_MEMBER) {
        const confirmed = await ask({
          title: 'Warning',
          messages: [
            `${selectedPlayer.name} does not have active membership, are you sure to sign them in with Non-Member?`
          ]
        })
        if (!confirmed) {
          return
        }
      }
      const rst: { success: boolean; msg?: string } = await signInPlayer(
        selectedPlayer,
        activeMembership.type,
        selectedPayment,
        selectedLocation,
        resolvedPrice,
        selectedQueue
      )
      if (!rst.success) {
        alertWithToast('danger', rst.msg ?? '')
        return
      }
      alertWithToast('success', `${selectedPlayer.name} is signed in.`)
      setActionCount((prev) => prev + 1)
      setSelectedPayment(null)
    } else if (selectedAdminOp == AdminOpType.MEMBERSHIP) {
      // handle membership operations
      if (!selectedPlayer) {
        alertWithToast('warning', `Invalid Player ${selectedPlayer}`)
        return
      }
      if (!selectedMembershipOperation) {
        alertWithToast('warning', `Invalid Membership ${selectedMembershipOperation}`)
        return
      }
      const activeMembership = resolveMembership(selectedPlayer)
      const rst: { success: boolean; msg?: string } = await updatePlayerMembership(
        selectedPlayer,
        activeMembership.type,
        selectedMembershipOperation,
        selectedPayment,
        resolvedPrice,
        selectedQueue
      )
      if (!rst.success) {
        alertWithToast('danger', rst.msg ?? '')
        return
      }
      alertWithToast('success', `${selectedMembershipOperation} granted to ${selectedPlayer.name}`)
      setActionCount((prev) => prev + 1)
      setSelectedPayment(null)
    } else if (selectedAdminOp == AdminOpType.FIRST_TIME_VISIT) {
      // handle first time visit player
      if (newPlayerName.length == 0) {
        alertWithToast('warning', 'New player name cannot be empty')
      }
      if (!selectedMembershipOperation) {
        alertWithToast('warning', `Invalid Membership ${selectedMembershipOperation}`)
        return
      }
      const rst: { success: boolean; message?: string } = await addNewPlayer(
        newPlayerName,
        newPlayerEmail,
        newPlayerDiscordHandle,
        selectedMembershipOperation,
        selectedPayment,
        resolvedPrice,
        selectedQueue
      )
      if (!rst.success) {
        alertWithToast('danger', rst.message ?? '')
        return
      }
      alertWithToast('success', `Added ${newPlayerName} for ${selectedMembershipOperation}`)
      setActionCount((prev) => prev + 1)
      setSelectedPayment(null)
      queryClient.invalidateQueries({ queryKey: ['players'] })
    } else {
      alertWithToast('danger', `Invalid oepration ${selectedAdminOp}`)
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
                <span className="text-sm font-medium md:min-w-[100px]">Name</span>
                <div className="flex-1 max-w-sm">
                  <Input
                    label=""
                    placeholder="e.g. Ichihime M."
                    value={newPlayerName}
                    onValueChange={setNewPlyaerName}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
                <span className="text-sm font-medium md:min-w-[100px]">Email</span>
                <div className="flex-1 max-w-sm">
                  <Input
                    type="email"
                    label=""
                    placeholder="e.g. ichihime@gmail.com"
                    value={newPlayerEmail}
                    onValueChange={setNewPlyaerEmail}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16">
                <span className="text-sm font-medium md:min-w-[100px]">Discord Handle</span>
                <div className="flex-1 max-w-sm">
                  <Input
                    label=""
                    placeholder="e.g. ichihime"
                    value={newPlayerDiscordHandle}
                    onValueChange={setNewPlyaerDiscordHandle}
                  />
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

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-8">
            <span className="text-sm font-medium md:min-w-[100px]">Cost (Fee Excluded)</span>
            <span>${resolvedPrice}</span>
          </div>
        </div>
        <Button type="submit" color="primary" className="px-6 font-bold" isLoading={isSubmitting}>
          Submit
        </Button>
      </Form>
      <ConfirmModal />

      <Divider className="mt-2" />
      <MultiLineAccordion
        title="Instruction"
        textlines={[
          'Select action, fill in related fields, and (optionally) queue type to sign in a player.',
          'Before submitting, double check the resolved cost.',
          'A player wihtout active membership will proceed with NON_MEMBER visit. If the player would like to update/extend memberhsip, switch to Membership action.',
          'For a first-time player that is not in our database, use FirstTimeVisit action.',
          'Click Submit to proceed, upon success the system will add a log and post a discord notification to admin channel.',
          'If a queue type is selected, the player will also be enqueued.',
          'Multiple sign-in attempts within the same day for a player will be prevented.',
          'Contact tech people if something goes wrong.'
        ]}
      ></MultiLineAccordion>

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
