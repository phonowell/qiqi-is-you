import CptLeveL, { Ref as RefLevel } from './Level'
import { ItemRaw, listValid } from '../module/Item'
import React from 'react'

// interface

type Props = {
  showToast: (input: string) => void
}

type Size = [number, number]

// function

const button: {
  (text: string, callback: () => void): JSX.Element
  (text: string, className: string, callback: () => void): JSX.Element
} = (
  ...args: [string, () => void] | [string, string, () => void]
) => {

    const [text, className, callback] = args.length === 2
      ? [args[0], '', args[1]]
      : args

    return (
      <div
        className={`btn ${className}`.trim()}
        onClick={callback}
      >{text}</div>
    )
  }

const changeBrush = (
  props: Props,
  brush: string,
  setBrush: (input: string) => void,
) => {

  // eslint-disable-next-line no-alert
  let stringBrush = (window.prompt(`Set Brush (${listValid.join(', ')})`, brush) || '').trim()

  if (!stringBrush) return
  if (stringBrush[0].toUpperCase() === stringBrush[0])
    stringBrush = stringBrush.toUpperCase()
  if (stringBrush === brush) return

  if (!listValid.includes(stringBrush)) {
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

// component

const Editor: React.FC<Props> = props => {

  const [brush, setBrush] = React.useState('qiqi')
  const [listItem, setListItem] = React.useState<ItemRaw[]>([])
  const [size, setSize] = React.useState<Size>([1, 1])
  const [title, setTitle] = React.useState('QIQI IS YOU')

  const $level: RefLevel = React.useRef(null)

  const load = () => {
    const string = localStorage.getItem('qiqi/editor')
    if (!string) return

    const data = JSON.parse(string)

    setListItem(data.listItem)
    setSize(data.size)
    setTitle(data.title)
  }
  React.useEffect(load, [])

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

      <CptLeveL
        ref={$level}
        brush={brush}
        listItem={listItem}
        isEditable={true}
        size={size}
        title={title}
        width={7.5}
      ></CptLeveL>

      <hr />

      <div
        className='btn btn-1'
        onClick={() => changeBrush(props, brush, setBrush)}
      >{`Brush: ${brush}`}</div>

      {button('Set Size', 'btn-2', () => changeSize(props, size, setSize))}
      {button('Set Title', 'btn-2', () => changeTitle(props, title, setTitle))}

      <hr />
      {button('Save', 'btn-1', save)}
      {button('Import', 'btn-2', () => null)}
      {button('Export', 'btn-2', () => null)}

    </div>
  )
}

// export
export default Editor