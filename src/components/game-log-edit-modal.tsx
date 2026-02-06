import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { convertGcpTimestampToDate, type GameLog, type PlayerScoreRecord } from './backend-manager'
import ScoreInputForm from './score-input-form'
import { useEffect, useState } from 'react'

type GameLogEditModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  log: GameLog
}
const GameLogEditModal = (props: GameLogEditModalProps) => {
  const [records, setRecords] = useState<PlayerScoreRecord[]>([])

  useEffect(() => {
    setRecords(
      props.log.players.map((item) => {
        return {
          player: {
            id: item.id,
            name: item.name
          },
          scoreData: {
            score: item.score,
            chombo: item.chombo
          }
        }
      })
    )
  }, [props.log])

  const onUpdateGame = async () => {
    console.log('!!! onUpdateGame')
    return true
  }

  return (
    <Modal size="md" isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Update Game</ModalHeader>
            <ModalBody>
              <p>{props.log.id}</p>
              <p>{convertGcpTimestampToDate(props.log.timestamp)?.toLocaleString()}</p>
              <ScoreInputForm
                records={records}
                setRecords={setRecords}
                onSubmit={onUpdateGame}
                hideSubmitButton={true}
                compact={true}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  console.log('updating! ', props.log.id)
                  onClose()
                }}
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default GameLogEditModal
