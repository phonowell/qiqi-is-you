import './Toast.css'
import React from 'react'

// interface

type Item = string[]

type Props = {
  message: string
}

// function

const Toast: React.FC<Props> = props => {

  const timer = React.useRef(0)
  const [list, setList] = React.useState<Item[]>([])

  const reduce = React.useCallback((): void => {

    setList(_list => {
      if (!_list.length) return [..._list]

      const listNew = _list.slice(1)

      if (listNew.length) {
        if (timer.current) clearTimeout(timer.current)
        timer.current = window.setTimeout(() => reduce(), 500)
      }

      return listNew
    })
  }, [])

  React.useEffect(() => {

    if (!props.message) return

    const listText = props.message
      .replace(/<br>/g, '\n')
      .split('\n')

    setList(_list => {
      const listNew = [
        ..._list,
        listText,
      ]
      if (listNew.length > 3) listNew.shift()
      return listNew
    })

    if (timer.current) clearTimeout(timer.current)
    timer.current = window.setTimeout(() => reduce(), 2e3 - 500)
  }, [props.message, reduce])

  return (
    <>
      {
        list.length
          ? (
            <div // #toast
              id='toast'
            >
              {
                list.map((item, i) => (
                  <div // .item
                    className='item'
                    key={`item-${i}-toast`}
                  >
                    <div // .inner
                      className='inner'
                    >
                      {item.map((text, j) => <p key={`${j}:${text}`}>{text}</p>)}
                    </div>
                  </div>
                ))
              }
            </div>
          )
          : null
      }
    </>
  )
}

// export
export default Toast