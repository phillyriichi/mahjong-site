import { Button, Form } from '@heroui/react'
import type { PlayerObject, PlayerScoreRecord, ScoreData } from './backend-manager'
import DividerWithText from './divider-with-text'
import ScoreInputWidget from './score-input-widget'
import { useState } from 'react'

type ScoreInputFormProps = {
  records: PlayerScoreRecord[]
  setRecords: (value: React.SetStateAction<PlayerScoreRecord[]>) => void
  onSubmit: () => Promise<boolean>
  hideSubmitButton?: boolean
  compact?: boolean
}

const ScoreInputForm = (props: ScoreInputFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successCount, setSuccessCount] = useState(0)
  return (
    <div className="w-full">
      <Form
        className="flex gap-4 w-full"
        key={`score-entry-form-${successCount}`}
        onSubmit={async (e) => {
          // prevent default behavior of refreshing the page.
          e.preventDefault()
          setIsSubmitting(true)
          const success = await props.onSubmit()
          setIsSubmitting(false)
          if (success) {
            setSuccessCount((prev) => prev + 1)
          }
        }}
      >
        {props.records.map((item, index) => {
          return (
            <div key={`input-${index}`}>
              {/* we need submitted in the key to enforce resettting the value after submission. */}
              <DividerWithText text={`Player ${index + 1}`} />
              <ScoreInputWidget
                player={item.player}
                scoreData={item.scoreData}
                onInputChange={(player: PlayerObject | null | undefined, scoreData: ScoreData) => {
                  props.setRecords((prev) =>
                    prev.map((record, i) => {
                      if (i !== index) {
                        return record
                      }
                      return {
                        player: player ? { ...player } : null,
                        scoreData: { ...scoreData }
                      }
                    })
                  )
                }}
                compact={props.compact}
              />
            </div>
          )
        })}
        <div className="flex font-bold mx-2 text-lg">
          Total: {props.records.reduce((prev, cur) => prev + cur.scoreData.score, 0)}
        </div>
        {props.hideSubmitButton ? (
          <></>
        ) : (
          <Button type="submit" color="primary" className="px-6 font-bold" isLoading={isSubmitting}>
            {' '}
            Submit{' '}
          </Button>
        )}
      </Form>
    </div>
  )
}

export default ScoreInputForm
