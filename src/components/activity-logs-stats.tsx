import { Spinner } from '@heroui/spinner'
import { useActivityLogs, type ActivityLogData } from './backend-manager'
import { CalendarDate } from '@internationalized/date'
import { useMemo } from 'react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'

type ActivityLogsStatsProps = {
  start: CalendarDate
  end: CalendarDate
}

function resolveLogsStats(activtyLogs: ActivityLogData[]) {
  let logStats: { [key: string]: { [key: string]: any } } = {
    signin: {
      MANGAN: { text: 'Mangan' },
      TANYAO: { text: 'Tanyao' },
      NON_MEMBER: { text: 'NonMember' }
    },
    membership: {
      MANGAN: { text: 'Mangan' },
      TANYAO: { text: 'Tanyao' },
      TANYAO2MANGAN: { text: 'Tan2Man' }
    },
    NonMemberSignin_transaction: {
      Cash: { text: 'Cash' },
      Card: { text: 'Card' },
      Venmo: { text: 'Venmo' },
      Voucher: { text: 'Voucher' }
    },
    MemberSignin_transaction: {
      Cash: { text: 'Cash' },
      Card: { text: 'Card' },
      Venmo: { text: 'Venmo' },
      Voucher: { text: 'Voucher' }
    },
    NewTanyao_transaction: {
      Cash: { text: 'Cash' },
      Card: { text: 'Card' },
      Venmo: { text: 'Venmo' },
      Voucher: { text: 'Voucher' }
    },
    NewMangan_transaction: {
      Cash: { text: 'Cash' },
      Card: { text: 'Card' },
      Venmo: { text: 'Venmo' },
      Voucher: { text: 'Voucher' }
    },
    Tan2Man_transaction: {
      Cash: { text: 'Cash' },
      Card: { text: 'Card' },
      Venmo: { text: 'Venmo' },
      Voucher: { text: 'Voucher' }
    },
    Total_transaction: {
      Cash: { text: 'Cash', textClass: 'danger' },
      Card: { text: 'Card', textClass: 'danger' },
      Venmo: { text: 'Venmo', textClass: 'danger' },
      Voucher: { text: 'Voucher', textClass: 'danger' }
    }
  }
  // Initialize stats object each category.
  Object.entries(logStats).forEach(([_, statsObj]) => {
    Object.entries(statsObj).forEach(([_, val]) => {
      val.count = 0
      val.price = 0
      if (!val.textClass) {
        val.textClass = 'dark'
      }
    })
  })
  // helper functino to map log to its transcation stats key.
  const resolveTransactionKey = function (log: ActivityLogData) {
    if (log.activity == 'SIGN_IN') {
      if (log.currentMembership == 'NON_MEMBER') {
        return 'NonMemberSignin'
      } else if (log.currentMembership == 'TANYAO' || log.currentMembership == 'MANGAN') {
        return 'MemberSignin'
      }
    } else if (log.activity == 'MEMBERSHIP') {
      if (log!.newMembership!.tier == 'TANYAO') {
        return 'NewTanyao'
      } else if (log!.newMembership!.tier == 'MANGAN') {
        return 'NewMangan'
      } else if (log!.newMembership!.tier == 'TANYAO2MANGAN') {
        return 'Tan2Man'
      }
    }
    return null
  }
  // Loop over logs and accumulate stats for each category.
  activtyLogs.forEach((log: ActivityLogData) => {
    if (log.activity == 'SIGN_IN') {
      if (log.payment.type == 'Waived') {
        // skip waived sign-in log as it has a corresponding membership update log, which will be counted in the following block.
        return
      }
      let key = log.currentMembership
      if (key! in logStats.signin) {
        logStats.signin[key!].count! += 1
        logStats.signin[key!].price! += log.payment.price ?? 0
      }
    }
    if (log.activity == 'MEMBERSHIP') {
      let key = log.newMembership!.tier
      if (key in logStats.membership) {
        logStats.membership[key!].count! += 1
        logStats.membership[key!].price! += log.payment.price ?? 0
      }
    }
    // Transaction stats
    const key = `${resolveTransactionKey(log)}_transaction`
    if (log.payment.type == 'Cash') {
      logStats[key].Cash.count! += 1
      logStats[key].Cash.price! += log.payment.price ?? 0
      logStats.Total_transaction.Cash.count! += 1
      logStats.Total_transaction.Cash.price! += log.payment.price ?? 0
    } else if (log.payment.type == 'Card') {
      logStats[key].Card.count! += 1
      logStats[key].Card.price! += log.payment.price ?? 0
      logStats.Total_transaction.Card.count! += 1
      logStats.Total_transaction.Card.price! += log.payment.price ?? 0
    } else if (log.payment.type == 'Venmo') {
      logStats[key].Venmo.count! += 1
      logStats[key].Venmo.price! += log.payment.price ?? 0
      logStats.Total_transaction.Venmo.count! += 1
      logStats.Total_transaction.Venmo.price! += log.payment.price ?? 0
    } else if (log.payment.type == 'Voucher') {
      logStats[key].Voucher.count! += 1
      logStats[key].Voucher.price! += log.payment.price ?? 0
      logStats.Total_transaction.Voucher.count! += 1
      logStats.Total_transaction.Voucher.price! += log.payment.price ?? 0
    }
  })
  // Compute TOTAL, generate displayText for each stats category, and remove empty ones.
  Object.entries(logStats).forEach(([statsKey, statsObj]) => {
    statsObj.TOTAL = Object.keys(statsObj).reduce(
      (cur, key) => {
        return {
          count: cur.count + statsObj[key].count!,
          price: cur.price + statsObj[key].price!,
          text: 'Total',
          textClass: 'danger'
        }
      },
      { count: 0, price: 0, text: 'Total', textClass: 'danger' }
    )
    Object.entries(statsObj).forEach(([_, val]) => {
      if (statsKey.endsWith('_transaction')) {
        if (val.count == 0) {
          val.displayText = '-'
        } else if (val.price == 0) {
          val.displayText = `${val.count}`
        } else {
          val.displayText = `${val.count}($${val.price})`
        }
      } else {
        val.displayText = `${val.text} ${val.count}`
      }
    })
    if (!statsKey.endsWith('_transaction')) {
      Object.keys(statsObj).forEach((key) => {
        if (key != 'TOTAL' && statsObj[key].count == 0) {
          delete statsObj[key]
        }
      })
    }
  })
  const transactionTableData = [
    { title: 'NonMember', ...logStats.NonMemberSignin_transaction },
    { title: 'Member', ...logStats.MemberSignin_transaction },
    { title: 'NewTanyao', ...logStats.NewTanyao_transaction },
    { title: 'NewMangan', ...logStats.NewMangan_transaction },
    { title: 'Tan2Man', ...logStats.Tan2Man_transaction },
    { title: 'Total', ...logStats.Total_transaction }
  ]

  return {
    transactionTableData: transactionTableData,
    logStats: logStats
  }
}

const ActivityLogsStats = (props: ActivityLogsStatsProps) => {
  const { data: activityLogs, isFetching } = useActivityLogs(props.start, props.end)
  const { transactionTableData } = useMemo(() => {
    if (!activityLogs) {
      return {
        transactionTableData: [],
        logStats: {}
      }
    }
    return resolveLogsStats(activityLogs)
  }, [activityLogs])

  const topContent = () => {
    if (isFetching) {
      return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
          <Spinner label="Loading..." color="success" size="lg" />
        </div>
      )
    }
    return <div></div>
  }

  return (
    <div className="w-full mt-3 min-h-[200px]">
      <Table
        aria-label="admin-player-profile-table"
        layout="auto"
        topContent={topContent()}
        isHeaderSticky
        classNames={{
          th: 'text-center text-tiny md:text-small md:py-4',
          td: 'text-center last:text-danger last:font-bold'
        }}
      >
        <TableHeader>
          <TableColumn className="text-left">Activity</TableColumn>
          <TableColumn>Cash</TableColumn>
          <TableColumn>Card</TableColumn>
          <TableColumn>Venmo</TableColumn>
          <TableColumn>Voucher</TableColumn>
          <TableColumn>Total</TableColumn>
        </TableHeader>

        <TableBody items={transactionTableData}>
          {(item: any) => {
            const isTotal = item.title === 'Total'

            const renderCellContent = (data: any) => {
              if (!data || data.count === 0) return <span className="text-default-300">-</span>
              return (
                <div className="flex flex-col items-center gap-0">
                  {data.price > 0 && (
                    <span className="text-[11px] md:text-small font-bold leading-tight">
                      ${data.price}
                    </span>
                  )}
                  <span
                    className={`text-[9px] md:text-tiny leading-tight ${
                      isTotal ? 'text-danger/80' : 'text-default-400'
                    }`}
                  >
                    ({data.count})
                  </span>
                </div>
              )
            }

            return (
              <TableRow
                key={item.title}
                className={isTotal ? 'text-danger bg-danger-50/50 font-bold' : ''}
              >
                <TableCell className="text-left text-[11px] md:text-small font-medium py-2 md:py-4">
                  {item.title}
                </TableCell>
                <TableCell className="py-2 md:py-4">{renderCellContent(item.Cash)}</TableCell>
                <TableCell className="py-2 md:py-4">{renderCellContent(item.Card)}</TableCell>
                <TableCell className="py-2 md:py-4">{renderCellContent(item.Venmo)}</TableCell>
                <TableCell className="py-2 md:py-4">{renderCellContent(item.Voucher)}</TableCell>
                <TableCell className="py-2 md:py-4">{renderCellContent(item.TOTAL)}</TableCell>
              </TableRow>
            )
          }}
        </TableBody>
      </Table>
    </div>
  )
}

export default ActivityLogsStats
