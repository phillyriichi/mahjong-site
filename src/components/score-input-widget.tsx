import { NumberInput } from '@heroui/number-input'
import type { PlayerObject, ScoreData } from './backend-manager'
import PlayerSelect from './player-select'

type ScoreInputWidgetProps = {
  player: PlayerObject | null | undefined
  scoreData: ScoreData
  onInputChange: (player: PlayerObject | null | undefined, scoreData: ScoreData) => void
  compact?: boolean
  variant?: 'flat' | 'underlined' | 'bordered' | 'faded'
}

const ScoreInputWidget = (props: ScoreInputWidgetProps) => {
  return (
    <div className="flex flex-wrap items-end gap-4 w-full">
      <div
        className={`
    ${props.compact ? 'flex-[4] min-w-[120px]' : 'w-full md:w-auto md:flex-1'}
  `}
      >
        <PlayerSelect
          className="w-full"
          selectedPlayer={props.player}
          onSelectionChange={(player: PlayerObject | null) => {
            props.onInputChange(player, props.scoreData)
          }}
          size="sm"
          variant={props.variant ?? 'underlined'}
        />
      </div>

      <div
        className={`
    flex gap-4 
    ${props.compact ? 'flex-[5]' : 'w-full md:w-auto md:flex-1'}
  `}
      >
        {/* Score */}
        <div className="flex-[2]">
          <NumberInput
            label="Score"
            value={props.scoreData.score}
            onValueChange={(value: number) => {
              if (!isNaN(value)) {
                props.onInputChange(props.player, { ...props.scoreData, score: value })
              }
            }}
            size="sm"
            step={100}
            isRequired
            variant={props.variant ?? 'underlined'}
          />
        </div>

        {/* Chombo */}
        <div className="flex-[1]">
          <NumberInput
            label="Chombo"
            value={props.scoreData.chombo}
            onValueChange={(value: number) => {
              if (!isNaN(value)) {
                props.onInputChange(props.player, { ...props.scoreData, chombo: value })
              }
            }}
            size="sm"
            minValue={0}
            maxValue={3}
            step={1}
            variant={props.variant ?? 'underlined'}
          />
        </div>
      </div>
    </div>
  )
}

export default ScoreInputWidget
