import { Spinner } from '@heroui/spinner'
import {
  formatDate,
  MembershipType,
  MembershipTypeText,
  resolveMembership,
  usePlayers,
  type PlayerObject
} from './backend-manager'
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
  const filteredPlayers = useMemo(() => {
    if (!players || !membershipFilter) {
      return []
    }
    const now = new Date()
    return Object.values(players)
      .filter((p) => {
        if (membershipFilter.id == 'ALL') {
          return true
        } else {
          return resolveMembership(p, now).type == membershipFilter.id
        }
      })
      .filter((p) => {
        if (!!searchFilter) {
          return p.name.toLowerCase().includes(searchFilter.toLowerCase())
        }
        return true
      })
  }, [players, membershipFilter.id, searchFilter])

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
          <Chip className="ml-2" color="default">
            Count: {filteredPlayers.length}
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
        </Chip>
        {resolvedMembership.expire && (
          <span className="ml-2">({formatDate(resolvedMembership.expire)})</span>
        )}
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
          layout="auto"
          isStriped
          topContent={topContent()}
          classNames={{
            base: 'max-w-full',
            table: 'min-w-[600px]'
          }}
        >
          <TableHeader>
            <TableColumn> ID </TableColumn>
            <TableColumn> Name </TableColumn>
            <TableColumn> Active Membership </TableColumn>
            <TableColumn> Email </TableColumn>
          </TableHeader>

          <TableBody items={filteredPlayers}>
            {(p) => (
              <TableRow key={`player-${p.id}`}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{renderActiveMembershipCell(p)}</TableCell>
                <TableCell>{p.email}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminPlayerProfile
