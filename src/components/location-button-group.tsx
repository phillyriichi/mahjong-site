import { type Key } from 'react'
import ToggleButtonGroup from './toggle-button-group'
import { LocationType } from './backend-manager'

type LocationButtonGroupProps = {
  location: LocationType | null
  setLocation: (location: LocationType) => void
}

const LocationButtonGroup = (props: LocationButtonGroupProps) => {
  const options = Object.values(LocationType).map((item) => {
    return { id: item, label: item }
  })
  return (
    <div className="w-full">
      <ToggleButtonGroup
        options={options}
        selectedKeys={props.location ? [props.location] : []}
        onSelectionChange={(location: Key, checked: boolean) => {
          if (checked) {
            if (!location || location != props.location) {
              props.setLocation(location as LocationType)
            }
          }
        }}
      />
    </div>
  )
}

export default LocationButtonGroup
