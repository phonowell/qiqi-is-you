import './Item.css'
import './Level.css'
import Input, { Action } from './Input'
import Level, { ItemRender } from '../module/Level'
import { ItemRaw } from '../module/Item'
import React from 'react'

// interface

type Direction = 'left' | 'right' | 'top' | 'bottom'

type Props = {
  brush: string
  isEditable: boolean
  listItem: ItemRaw[]
  ref: Ref
  size: Size
  title: string
  width: number
}

type Ref = React.Ref<{
  listItem: ItemRaw[]
  size: [number, number]
  title: string
}>

type Size = [number, number]

// variable

const level = new Level()

// component

const CptLeveL: React.FC<Props> = React.forwardRef((
  props,
  ref: Ref,
) => {

  React.useEffect(() => {
    level.load(props.listItem, props.size)
    render()
  }, [props.listItem, props.size])

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

    const list2bRemoved = level.getByPosition(x, y)
    if (list2bRemoved.length) level.remove(list2bRemoved)
    else level.add({ type: props.brush, x, y })

    render()
  }

  const input = (
    name: Action,
    data?: unknown,
  ) => {
    // console.log(name, data)
    if (name === 'move') level.move(data as Direction)
    render()
  }

  const [listItem, setListItem] = React.useState<ItemRender[]>([])
  const [listRule, setListRule] = React.useState<string[]>([])
  const render = () => {
    const ts = Date.now()
    setListItem(level.render())
    setListRule(level.renderRule())
    console.log(`renderred in ${Date.now() - ts} ms`)
  }

  return (<>
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
                ...item.status.map(status => `status-${status}`),
                `type-${item.type}`,
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

    <div id='rule'>
      {listRule.map((rule, i) => <p key={i}>{rule}</p>)}
    </div>

    <Input
      emit={input}
    ></Input>
  </>)
})

// export
export type { Ref }
export default CptLeveL