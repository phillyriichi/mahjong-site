import { useEffect, useState } from 'react'
import {
  DEFAULT_SCORE_DATA,
  submitGameResults,
  usePlayers,
  type PlayerScoreRecord,
  type RulesetObject
} from './backend-manager'
import { addToast } from '@heroui/toast'
import { hasDuplication } from './utilities'
import useConfirm from './confirm-modal'
import ScoreInputForm from './score-input-form'
import { useSearchParams } from 'wouter'

function validateRecords(ruleset: RulesetObject | null | undefined, records: PlayerScoreRecord[]) {
  if (!ruleset) {
    return {
      recordsAreValid: false,
      recordsInvalidMessage: `Invalid Ruleset`
    }
  }
  if (records.length != ruleset.numPlayers) {
    return {
      recordsAreValid: false,
      recordsInvalidMessage: `Wrong numPlayers ${records.length} (the ruleset speicifies ${ruleset.numPlayers})`
    }
  }
  if (records.some((item) => !item.player || !item.player.id)) {
    return {
      recordsAreValid: false,
      recordsInvalidMessage: `There are invalid player(s)`
    }
  }
  if (hasDuplication(records.map((item) => item.player?.id))) {
    return {
      recordsAreValid: false,
      recordsInvalidMessage: `There are duplicated players`
    }
  }
  const totalScore = records.reduce((prev, cur) => prev + cur.scoreData.score, 0)
  const expectedTotalScore = ruleset.numPlayers * ruleset.startingPoints
  if (totalScore > expectedTotalScore) {
    return {
      recordsAreValid: false,
      recordsInvalidMessage: `Total Score (${totalScore}) is higher than allowed (${expectedTotalScore}).`
    }
  }
  return {
    recordsAreValid: true,
    recordsInvalidMessage: ``
  }
}

type LeagueScoreEntryProps = {
  ruleset: RulesetObject | null
}

const LeagueScoreEntry = (props: LeagueScoreEntryProps) => {
  const [searchParams] = useSearchParams()
  const [records, setRecords] = useState<PlayerScoreRecord[]>([])
  const { data: availablePlayers } = usePlayers()
  const { ask } = useConfirm()

  // Fill/Remove related score records when ruleset is updated.
  useEffect(() => {
    const targetLength = props.ruleset?.numPlayers ?? 0
    if (!targetLength) {
      setRecords([])
    }
    setRecords((prev) => {
      if (prev.length === targetLength) return prev
      if (prev.length > targetLength) {
        return prev.slice(0, targetLength)
      }
      const diff = targetLength - prev.length
      const newRecords = Array(diff)
        .fill(null)
        .map(() => ({
          player: null,
          scoreData: { ...DEFAULT_SCORE_DATA }
        }))
      return [...prev, ...newRecords]
    })
  }, [props.ruleset])

  // Fill player names based on url params
  useEffect(() => {
    if (!!availablePlayers) {
      setRecords((prev) => {
        const urlPlayerIds = searchParams.getAll('players')
        const newRecords = [...prev]
        for (let i = 0; i < Math.min(newRecords.length, urlPlayerIds.length); ++i) {
          newRecords[i].player = availablePlayers[Number(urlPlayerIds[i])]
        }
        return newRecords
      })
    }
  }, [availablePlayers])

  const onSubmitScores = async () => {
    // Exclude scenarios
    const { recordsAreValid, recordsInvalidMessage } = validateRecords(props.ruleset, records)
    if (!recordsAreValid) {
      addToast({
        title: 'Error',
        description: recordsInvalidMessage,
        color: 'danger',
        variant: 'flat',
        classNames: {
          base: 'max-w-[400px] min-h-[120px]',
          title: 'text-lg font-bold',
          description: 'text-lg'
        }
      })
      return false
    }
    // There might be leftover riichi sticks when total score is lower than expected, thus we ask for confirmation.
    const totalScore = records.reduce((prev, cur) => prev + cur.scoreData.score, 0)
    const expectedTotalScore =
      (props.ruleset?.numPlayers ?? 0) * (props.ruleset?.startingPoints ?? 0)
    if (totalScore < expectedTotalScore) {
      const confirmed = await ask({
        title: 'Warning',
        messages: [
          `${totalScore} is lower than expected total score ${expectedTotalScore}, are you sure?`
        ]
      })
      if (!confirmed) {
        return false
      }
    }
    // Now we submit the score to backend.
    await submitGameResults(props.ruleset!, records)
    addToast({
      title: 'Summitted',
      description: 'Remember to join the next shuffle',
      color: 'success',
      variant: 'flat',
      classNames: {
        base: 'max-w-[400px] min-h-[120px]',
        title: 'text-lg font-bold',
        description: 'text-lg'
      }
    })
    // Reset fields
    const val = Array.from({ length: props.ruleset!.numPlayers }, () => {
      return { player: null, scoreData: DEFAULT_SCORE_DATA }
    })
    setRecords(val)
    return true
  }

  return (
    <div className="flex flex-col w-full max-w-full mx-auto px-2 gap-y-6">
      <ScoreInputForm records={records} setRecords={setRecords} onSubmit={onSubmitScores} />
    </div>
  )
}

export default LeagueScoreEntry
