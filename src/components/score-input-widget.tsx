import { NumberInput } from '@heroui/number-input'
import type { PlayerObject, ScoreData } from './backend-manager'
import PlayerSelect from './player-select'

type ScoreInputWidgetProps = {
  player: PlayerObject | null | undefined
  scoreData: ScoreData
  onInputChange: (player: PlayerObject | null | undefined, scoreData: ScoreData) => void
}

const ScoreInputWidget = (props: ScoreInputWidgetProps) => {
  return (
    <div className="flex flex-row items-end gap-4 w-full mb-4">
      <PlayerSelect
        selectedPlayer={props.player}
        onSelectionChange={(player: PlayerObject | null) => {
          props.onInputChange(player, props.scoreData)
        }}
        className="max-w-[200px] lg:max-w-[400px]"
      />

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
        className="max-w-[100px] lg:max-w-[200px]"
      />

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
        className="max-w-[80px] lg:max-w-[120px]"
      />
    </div>
  )
}

export default ScoreInputWidget
