import { Spinner } from '@heroui/spinner'
import { MembershipType, resolveMembership, usePlayers } from './backend-manager'
import BaseSingleSelect from './base-single-select'
import { useMemo, useState } from 'react'
import type { Key } from '@react-types/shared'
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@heroui/react'

const avialbleFilters = [
  { id: 'TANYAO', selectText: 'Tanyao' },
  { id: 'MANGAN', selectText: 'Mangan' },
  { id: 'NON_MEMBER', selectText: 'NonMember' },
  { id: 'ALL', selectText: 'All' }
]

function summarizeMembershipStatus(membership: {
  type: MembershipType
  expire: Date | null
}): string {
  if (!membership.expire) {
    return membership.type
  } else {
    return `${membership.type} (${membership.expire.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    })})`
  }
}

const AdminPlayerProfile = () => {
  const { data: players, isLoading } = usePlayers()
  const [membershipFilter, setMembershipFilter] = useState(avialbleFilters[0])
  const filteredPlayers = useMemo(() => {
    if (!players || !membershipFilter) {
      return []
    }
    const now = new Date()
    return players.filter((p) => {
      if (membershipFilter.id == 'ALL') {
        return true
      } else {
        return resolveMembership(p, now).type == membershipFilter.id
      }
    })
  }, [players, membershipFilter.id])

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center min-h-[400px]">
        <Spinner label="Loading" />
      </div>
    )
  }

  const topContent = () => {
    return (
      <div className="w-full row">
        <BaseSingleSelect
          className="max-w-[50%] max-w-[200px]"
          label="Membership"
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
        <Chip className="ml-2" size="lg" color="default">
          Count: {filteredPlayers.length}
        </Chip>
      </div>
    )
  }

  return (
    <div className="w-full min-h-[400px]">
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
              <TableCell>{summarizeMembershipStatus(resolveMembership(p))}</TableCell>
              <TableCell>{p.email}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminPlayerProfile
