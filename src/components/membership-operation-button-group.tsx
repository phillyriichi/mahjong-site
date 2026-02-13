import { useMemo, type Key } from 'react'
import ToggleButtonGroup from './toggle-button-group'
import { useMembershipTiers } from './backend-manager'

type MembershipOperationButtonGroupProps = {
  membershipOperation: string | null
  setMembershipOperation: (membershipOperation: string) => void
  firstTimeVisit: boolean
}

const MembershipOperationButtonGroup = (props: MembershipOperationButtonGroupProps) => {
  const { data, isPending } = useMembershipTiers()

  const options = useMemo(() => {
    if (isPending) {
      return []
    }
    return Object.entries(data)
      .filter(([key, _]: any) => {
        if (key == 'SINGLE_VISIT_KOP') {
          return false
        }
        if (props.firstTimeVisit) {
          return key != 'TANYAO2MANGAN'
        } else {
          return key != 'SINGLE_VISIT'
        }
      })
      .map(([key, val]: any) => {
        return { id: key, label: key, labelText: val.name }
      })
  }, [data, props.firstTimeVisit])

  return (
    <div className="w-full">
      <ToggleButtonGroup
        options={options}
        selectedKeys={props.membershipOperation ? [props.membershipOperation] : []}
        onSelectionChange={(membershipOperation: Key, checked: boolean) => {
          if (checked) {
            if (!membershipOperation || membershipOperation != props.membershipOperation) {
              props.setMembershipOperation(membershipOperation as string)
            }
          }
        }}
      />
    </div>
  )
}

export default MembershipOperationButtonGroup
