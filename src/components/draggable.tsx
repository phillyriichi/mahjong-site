import { useDroppable } from '@dnd-kit/core'

type DroppableProps = {
  id: string
  children: any
}

export function Droppable(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id
  })
  const style = {
    color: isOver ? 'green' : undefined
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}
