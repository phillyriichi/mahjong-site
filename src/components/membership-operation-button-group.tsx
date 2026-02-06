import { type Key } from 'react'
import ToggleButtonGroup from './toggle-button-group'
import { MembershipOperationType } from './backend-manager'

type MembershipOperationButtonGroupProps = {
  membershipOperation: MembershipOperationType | null
  setMembershipOperation: (membershipOperation: MembershipOperationType) => void
  firstTimeVisit: boolean
}

const MembershipOperationButtonGroup = (props: MembershipOperationButtonGroupProps) => {
  const options = Object.values(MembershipOperationType)
    .filter((item) => {
      if (props.firstTimeVisit) {
        return item != MembershipOperationType.TAN2MAN
      } else {
        return item != MembershipOperationType.SINGLE_VISIT
      }
    })
    .map((item) => {
      return { id: item, label: item }
    })
  return (
    <div className="w-full">
      <ToggleButtonGroup
        options={options}
        selectedKeys={props.membershipOperation ? [props.membershipOperation] : []}
        onSelectionChange={(membershipOperation: Key, checked: boolean) => {
          if (checked) {
            if (!membershipOperation || membershipOperation != props.membershipOperation) {
              props.setMembershipOperation(membershipOperation as MembershipOperationType)
            }
          }
        }}
      />
    </div>
  )
}

export default MembershipOperationButtonGroup
