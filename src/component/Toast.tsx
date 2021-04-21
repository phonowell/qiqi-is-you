import './Toast.css'
import React from 'react'

// interface

type Item = string[]

type Props = {
  message: string
}

// function

const clearTimer = (
  timer: React.MutableRefObject<number>,
) => {
  if (!timer.current) return
  window.clearTimeout(timer.current)
}

// component

const Toast: React.FC<Props> = props => {

  const timer = React.useRef(0)
  const [listMessage, setListMessage] = React.useState<Item[]>([])

  const reduce = React.useCallback((): void => {

    setListMessage(list => {
      if (!list.length) return [...list]

      const listNew = list.slice(1)

      if (listNew.length) {
        clearTimer(timer)
        timer.current = window.setTimeout(reduce, 500)
      }

      return listNew
    })
  }, [])

  React.useEffect(() => {

    if (!props.message) return

    const listMsg = props.message
      .replace(/<br>/g, '\n')
      .split('\n')

    setListMessage(list => {
      const listNew = [
        ...list,
        listMsg,
      ]
      if (listNew.length > 3) listNew.shift()
      return listNew
    })

    clearTimer(timer)
    timer.current = window.setTimeout(reduce, 2e3 - 500)
  }, [props.message, reduce])

  return (<>{listMessage.length
    ? <div id='toast'>
      {
        listMessage.map((item, i) => (
          <div
            className='item'
            key={`item-${i}-toast`}
          >
            <div className='inner'>
              {item.map((text, j) => <p key={`${j}:${text}`}>{text}</p>)}
            </div>
          </div>
        ))
      }
    </div>
    : null
  }</>)
}

// export
export default Toast