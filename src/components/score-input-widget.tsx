import { NumberInput } from '@heroui/number-input'
import type { PlayerObject, ScoreData } from './backend-manager'
import PlayerSelect from './player-select'

type ScoreInputWidgetProps = {
  player: PlayerObject | null | undefined
  scoreData: ScoreData
  onInputChange: (player: PlayerObject | null | undefined, scoreData: ScoreData) => void
  compact?: boolean
}

const ScoreInputWidget = (props: ScoreInputWidgetProps) => {
  return (
    <div className="flex flex-wrap md:flex-row items-end gap-4 w-full mb-1">
      <div className={props.compact ? 'w-full flex-4' : 'w-full md:flex-1'}>
        <PlayerSelect
          className="w-full"
          selectedPlayer={props.player}
          onSelectionChange={(player: PlayerObject | null) => {
            props.onInputChange(player, props.scoreData)
          }}
        />
      </div>

      <div className={props.compact ? 'flex-3' : 'md:flex-1'}>
        <NumberInput
          label="Score"
          value={props.scoreData.score}
          onValueChange={(value: number) => {
            if (!isNaN(value)) {
              props.onInputChange(props.player, {
                ...props.scoreData,
                score: value
              })
            }
          }}
          step={100}
          isRequired
          variant="underlined"
        />
      </div>

      <div className={props.compact ? 'flex-2' : 'md:flex-1'}>
        <NumberInput
          label="Chombo"
          value={props.scoreData.chombo}
          onValueChange={(value: number) => {
            if (!isNaN(value)) {
              props.onInputChange(props.player, {
                ...props.scoreData,
                chombo: value
              })
            }
          }}
          minValue={0}
          maxValue={3}
          step={1}
          variant="underlined"
        />
      </div>
    </div>
  )
}

export default ScoreInputWidget
