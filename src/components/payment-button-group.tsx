import { type Key } from 'react'
import ToggleButtonGroup from './toggle-button-group'
import { PaymentType } from './backend-manager'

type PaymentButtonGroupProps = {
  payment: PaymentType | null
  setPayment: (payment: PaymentType) => void
}

const PaymentButtonGroup = (props: PaymentButtonGroupProps) => {
  const options = Object.values(PaymentType).map((item) => {
    return { id: item, label: item }
  })
  return (
    <div className="w-full">
      <ToggleButtonGroup
        options={options}
        selectedKeys={props.payment ? [props.payment] : []}
        onSelectionChange={(payment: Key, checked: boolean) => {
          if (checked) {
            if (!payment || payment != props.payment) {
              props.setPayment(payment as PaymentType)
            }
          }
        }}
      />
    </div>
  )
}

export default PaymentButtonGroup
