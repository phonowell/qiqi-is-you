import Level, { Item as ItemLevel, Ref as RefLevel } from './Level'
import React from 'react'

// interface

type Props = {
  showToast: (input: string) => void
}

type Size = [number, number]

// variable

const listBrush = [
  'IS',
  'KLEE',
  'PUSH',
  'QIQI',
  'ROCK',
  'WIN',
  'YOU',
  'klee',
  'qiqi',
  'rock',
]

// function

const button = (
  text: string,
  callback: () => void,
) => (
  <div
    className='btn'
    onClick={callback}
  >{text}</div>
)

const changeBrush = (
  props: Props,
  brush: string,
  setBrush: (input: string) => void,
) => {

  // eslint-disable-next-line no-alert
  const stringBrush = (window.prompt('Set Brush', brush) || '').trim()

  if (!stringBrush) return
  if (stringBrush === brush) return

  if (!listBrush.includes(stringBrush)) {
    props.showToast(`Invalid brush: '${stringBrush}'`)
    return
  }

  setBrush(stringBrush)
  props.showToast(`Brush: '${brush}' -> '${stringBrush}'`)
}

const changeSize = (
  props: Props,
  size: [number, number],
  setSize: (input: [number, number]) => void,
) => {

  // eslint-disable-next-line no-alert
  const stringWidth = (window.prompt('Set Width', size[0].toString()) || '0').trim()
  if (!stringWidth) return

  const width = parseInt(stringWidth, 10)
  if (!(width >= 1)) {
    props.showToast(`Invalid Width: ${width}`)
    return
  }

  // eslint-disable-next-line no-alert
  const stringHeight = (window.prompt('Set Height', size[1].toString()) || '0').trim()
  if (!stringHeight) return

  const height = parseInt(stringHeight, 10)
  if (!(height >= 1)) {
    props.showToast(`Invalid Height: ${height}`)
    return
  }

  setSize([width, height])
  props.showToast(`Size: [${size[0]}, ${size[1]}] -> [${width}, ${height}]`)
}

const changeTitle = (
  props: Props,
  title: string,
  setTitle: (input: string) => void,
) => {

  // eslint-disable-next-line no-alert
  const stringTitle = (window.prompt('Set Title', title) || '').trim()

  if (!stringTitle) return
  if (stringTitle === title) return

  setTitle(stringTitle)
  props.showToast(`Title: '${title}' -> '${stringTitle}'`)
}

const Editor: React.FC<Props> = props => {

  const [brush, setBrush] = React.useState('qiqi')
  const [listItem, setListItem] = React.useState<ItemLevel[]>([])
  const [size, setSize] = React.useState<Size>([1, 1])
  const [title, setTitle] = React.useState('QIQI IS YOU')

  React.useEffect(() => load(), [])

  const $level: RefLevel = React.useRef(null)

  const load = () => {
    const string = localStorage.getItem('qiqi/editor')
    if (!string) return

    const data = JSON.parse(string)

    setListItem(data.listItem)
    setSize(data.size)
    setTitle(data.title)
  }

  const save = () => {
    if (!$level.current) return
    localStorage.setItem('qiqi/editor', JSON.stringify({
      listItem: $level.current.listItem.map(it => ({
        type: it.type,
        x: it.x,
        y: it.y,
      })),
      size: $level.current.size,
      title: $level.current.title,
    }))
    props.showToast('Level Saved')
  }

  return (
    <div id='editor'>

      <Level
        ref={$level}
        brush={brush}
        listItem={listItem}
        isEditable={true}
        size={size}
        title={title}
        width={7.5}
      ></Level>

      <hr />
      {button('Set Brush', () => changeBrush(props, brush, setBrush))}
      {button('Set Size', () => changeSize(props, size, setSize))}
      {button('Set Title', () => changeTitle(props, title, setTitle))}

      <hr />
      {button('Save', save)}

    </div>
  )
}

// export
export default Editor