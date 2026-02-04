import { DateRangePicker } from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import ActivityLogsTable from './activity-logs-table'
import { useLocalStorage } from 'usehooks-ts'

const AdminMembership = () => {
  const [storedRange, setStoredRange] = useLocalStorage('activity-logs-date-range', {
    start: today(getLocalTimeZone()).toString(),
    end: today(getLocalTimeZone()).toString()
  })
  const dateRange = {
    start: parseDate(storedRange.start),
    end: parseDate(storedRange.end)
  }

  return (
    <div className="w-full min-h-[400px]">
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
      <div className="w-full overflow-x-auto mt-3">
        <ActivityLogsTable start={dateRange.start} end={dateRange.end} />
      </div>
    </div>
  )
}

export default AdminMembership
