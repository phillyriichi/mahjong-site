import { Divider } from '@heroui/divider'

type DividerWithTextProps = {
  text: string | null | undefined
  dividerClassName?: string
  textClassName?: string
}

export default function DividerWithText(props: DividerWithTextProps) {
  return (
    <div className="flex items-center w-full my-2">
      <Divider className={props.dividerClassName ?? 'flex-1'} />
      <span className={props.textClassName ?? 'px-3 text-default-400 italic'}> {props.text} </span>
      <Divider className={props.dividerClassName ?? 'flex-1'} />
    </div>
  )
}
