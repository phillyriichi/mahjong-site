import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/header'
import Page from '../../components/page'
import {
  DEFAULT_SCORE_DATA,
  submitGameResults,
  type PlayerScoreRecord,
  type RulesetObject
} from '../../components/backend-manager'
import RulesetSelect from '../../components/ruleset-select'
import { addToast } from '@heroui/toast'
import { hasDuplication } from '../../components/utilities'
import useConfirm from '../../components/confirm-modal'
import ScoreInputForm from '../../components/score-input-form'

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

const ScoreEntry = () => {
  const [ruleset, setRuleset] = useState<RulesetObject | null>()
  const [records, setRecords] = useState<PlayerScoreRecord[]>([])
  const { ask, ConfirmModal } = useConfirm()

  // Fill/Remove related score records when ruleset is updated.
  useEffect(() => {
    const targetLength = ruleset?.numPlayers ?? 0
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
  }, [ruleset])

  const onSubmitScores = async () => {
    // Exclude scenarios
    const { recordsAreValid, recordsInvalidMessage } = validateRecords(ruleset, records)
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
    const expectedTotalScore = (ruleset?.numPlayers ?? 0) * (ruleset?.startingPoints ?? 0)
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
    await submitGameResults(ruleset!, records)
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
    const val = Array.from({ length: ruleset!.numPlayers }, () => {
      return { player: null, scoreData: DEFAULT_SCORE_DATA }
    })
    setRecords(val)
    return true
  }

  return (
    <Page title="Philly Mah-Jawn Mahjong Club">
      <PageHeader text="Score Entry" />

      <div>
        <RulesetSelect selectedRuleset={ruleset} onSelectionChange={setRuleset} />
      </div>

      <ScoreInputForm records={records} setRecords={setRecords} onSubmit={onSubmitScores} />

      <ConfirmModal />
    </Page>
  )
}

export default ScoreEntry
