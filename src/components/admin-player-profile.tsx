import { Spinner } from '@heroui/spinner'
import {
  formatDate,
  MembershipType,
  MembershipTypeText,
  resolveMembership,
  usePlayers,
  type PlayerObject
} from './backend-manager'
import type { SortDescriptor } from '@heroui/react'
import BaseSingleSelect from './base-single-select'
import { useMemo, useState } from 'react'
import type { Key } from '@react-types/shared'
import {
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@heroui/react'
import PlayerUpdateInputForm from './player-update-input-form'
import DividerWithText from './divider-with-text'
import { Icon } from '@iconify/react'

const avialbleFilters = [
  { id: 'ALL', selectText: 'All' },
  { id: 'TANYAO', selectText: 'Tanyao' },
  { id: 'MANGAN', selectText: 'Mangan' },
  { id: 'NON_MEMBER', selectText: 'NonMember' }
]

const AdminPlayerProfile = () => {
  const { data: players, isLoading } = usePlayers()
  const [membershipFilter, setMembershipFilter] = useState(avialbleFilters[0])
  const [searchFilter, setSearchFilter] = useState('')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending'
  })

  const sortedPlayers = useMemo(() => {
    if (!players) {
      return []
    }

    return Object.values(players).sort((a, b) => {
      const col = sortDescriptor.column as keyof typeof a
      if (!col) return 0
      const first = a[col]
      const second = b[col]
      let cmp = 0
      if (typeof first === 'number' && typeof second === 'number') {
        // compare number
        cmp = first < second ? -1 : first > second ? 1 : 0
      } else {
        // compare string
        const aStr = (first?.toString() || '').toLowerCase()
        const bStr = (second?.toString() || '').toLowerCase()
        cmp = aStr.localeCompare(bStr)
      }
      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, players])

  const filteredSortedPlayers = useMemo(() => {
    if (!sortedPlayers || !membershipFilter) {
      return []
    }
    const now = new Date()
    return sortedPlayers
      .filter((p) => {
        if (membershipFilter.id == 'ALL') {
          return true
        } else {
          return resolveMembership(p, now).type == membershipFilter.id
        }
      })
      .filter((p) => {
        if (!!searchFilter) {
          return (
            p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            String(p.id).includes(searchFilter.toLocaleLowerCase())
          )
        }
        return true
      })
  }, [sortedPlayers, membershipFilter.id, searchFilter])

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center min-h-[400px]">
        <Spinner label="Loading" />
      </div>
    )
  }

  const topContent = () => {
    return (
      <div className="w-full flex flex-col sm:flex-row sm:items-center gap-6 py-4">
        <div className="flex items-center gap-4 flex-[8] min-w-0">
          <BaseSingleSelect
            className="max-w-[50%] max-w-[200px]"
            label="Membership Filter"
            availableItems={avialbleFilters}
            isLoading={false}
            selectedKey={membershipFilter.id}
            onSelectionChange={(key: Key) => {
              const found = avialbleFilters.find((item) => item.id === key)
              if (found) {
                setMembershipFilter({ ...found })
              } else {
                setMembershipFilter({ ...avialbleFilters[0] })
              }
            }}
          />
          <Chip className="ml-2" color="default" size="sm">
            Count: {filteredSortedPlayers.length}
          </Chip>
        </div>

        <div className="flex-[2] min-w-[200px]">
          <Input
            isClearable
            className="w-full"
            placeholder="Search Player"
            size="sm"
            startContent={<Icon icon="material-symbols:search" />}
            onClear={() => {
              setSearchFilter('')
            }}
            onValueChange={setSearchFilter}
          />
        </div>
      </div>
    )
  }

  const renderActiveMembershipCell = (p: PlayerObject) => {
    const resolvedMembership = resolveMembership(p)
    const color =
      resolvedMembership.type == MembershipType.MANGAN
        ? 'warning'
        : resolvedMembership.type == MembershipType.TANYAO
          ? 'primary'
          : 'default'
    return (
      <div className="w-full">
        <Chip color={color} size="sm">
          {MembershipTypeText[resolvedMembership.type]}
          {resolvedMembership.expire && <span>({formatDate(resolvedMembership.expire)})</span>}
        </Chip>
      </div>
    )
  }

  return (
    <div className="w-full">
      <DividerWithText text={'Update Player Info'} />
      <div className="w-full">
        <PlayerUpdateInputForm />
      </div>

      <DividerWithText text={'Exitsing Players'} />

      <div className="w-full mt-2 min-h-[400px]">
        <Table
          aria-label="admin-player-profile-table"
          isVirtualized
          layout="auto"
          isStriped
          topContent={topContent()}
          sortDescriptor={sortDescriptor}
          onSortChange={(des) => {
            console.log('>>> des = ', des)
            setSortDescriptor(des)
          }}
          classNames={{
            base: 'max-w-full',
            table: 'min-w-[600px]'
          }}
        >
          <TableHeader>
            <TableColumn key="id" allowsSorting>
              {' '}
              ID{' '}
            </TableColumn>
            <TableColumn key="name" allowsSorting>
              {' '}
              Name{' '}
            </TableColumn>
            <TableColumn key="membership"> Active Membership </TableColumn>
            <TableColumn key="email" allowsSorting>
              {' '}
              Email{' '}
            </TableColumn>
            <TableColumn key="discordHandle" allowsSorting>
              {' '}
              Discord Handle
            </TableColumn>
          </TableHeader>

          <TableBody items={filteredSortedPlayers}>
            {(p) => (
              <TableRow key={`player-${p.id}`}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{renderActiveMembershipCell(p)}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.discordHandle}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminPlayerProfile
