import { type Key } from 'react'
import ToggleButtonGroup from './toggle-button-group'
import { AdminOpType } from './backend-manager'

type AdminOpButtonGroupProps = {
  adminOp: AdminOpType | null
  setAdminOp: (adminOp: AdminOpType) => void
}

const AdminOpButtonGroup = (props: AdminOpButtonGroupProps) => {
  const options = Object.values(AdminOpType).map((item) => {
    return { id: item, label: item }
  })
  return (
    <div className="w-full">
      <ToggleButtonGroup
        options={options}
        selectedKeys={props.adminOp ? [props.adminOp] : []}
        onSelectionChange={(adminOp: Key, checked: boolean) => {
          if (checked) {
            if (!adminOp || adminOp != props.adminOp) {
              props.setAdminOp(adminOp as AdminOpType)
            }
          }
        }}
      />
    </div>
  )
}

export default AdminOpButtonGroup
