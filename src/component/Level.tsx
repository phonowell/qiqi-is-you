import './Level.css'
import React from 'react'

// interface

type Item = {
  id?: string
  type: string
  x: number
  y: number
}

type Props = {
  brush: string
  isEditable: boolean
  listItem: Item[]
  ref: Ref
  size: [number, number]
  title: string
  width: number
}

type Ref = React.Ref<{
  listItem: Item[]
  setListItem: (input: Item[]) => void
  size: [number, number]
  title: string
}>

// function

const Level: React.FC<Props> = React.forwardRef((
  props,
  ref: Ref,
) => {

  const [listItem, setListItem] = React.useState<Item[]>([])
  React.useEffect(() => {
    setListItem(
      [...props.listItem].map(it => ({
        id: makeId(),
        type: it.type,
        x: it.x,
        y: it.y,
      })),
    )
  }, [props.listItem])

  const [size, setSize] = React.useState(0)
  React.useEffect(() => {
    setSize(props.width / props.size[0])
  }, [props.size, props.width])

  const [style, setStyle] = React.useState<React.CSSProperties>({})
  React.useEffect(() => {
    const width = size * props.size[0]
    const height = size * props.size[1]
    setStyle({
      height: `${height}rem`,
      width: `${width}rem`,
    })
  }, [props.size, size])

  // title
  React.useEffect(() => {
    if (!props.title) return
    document.title = props.title
  }, [props.title])

  const $level = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => ({
    listItem,
    setListItem,
    size: props.size,
    title: props.title,
  }))

  const edit = (
    e: React.MouseEvent,
  ) => {

    if (!props.isEditable) return
    if (!$level.current) return
    const rectLevel = $level.current.getBoundingClientRect()
    const rem = parseFloat(document.documentElement.style.fontSize)

    const x = Math.floor((e.pageX - rectLevel.left) / rem / size)
    const y = Math.floor((e.pageY - rectLevel.top) / rem / size)

    const listIt = getItemByPosition(x, y)
    if (listIt.length) {
      removeItem(listIt)
      return
    }

    setListItem(list => [
      ...list,
      {
        id: makeId(),
        type: props.brush,
        x,
        y,
      },
    ])
  }

  const getItemByPosition = (
    x: number,
    y: number,
  ): Item[] => listItem.filter(it => it.x === x && it.y === y)

  const removeItem = (
    listIt: Item[],
  ) => {
    if (!listIt.length) return
    const listId = listIt.map(it => it.id)
    setListItem(list => list.filter(it => !listId.includes(it.id)))
  }

  return (
    <div id='level'
      onClick={edit}
      ref={$level}
      style={style}
    >
      {
        listItem.map(item => (
          <div
            className={
              [
                'item',
                `type-${item.type}`,
                item.type[0].toUpperCase() === item.type[0]
                  ? 'is-text'
                  : '',
              ].join(' ').trim()
            }
            key={item.id}
            style={{
              height: `${size}rem`,
              transform: `translate(${item.x * size}rem, ${item.y * size}rem)`,
              width: `${size}rem`,
            }}
          ></div>
        ))
      }
    </div>
  )
})

const makeId = () => Math.random()
  .toString(36)
  .slice(-8)

// export
export type { Item, Ref }
export default Level