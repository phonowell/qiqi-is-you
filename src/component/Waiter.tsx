import './Waiter.css'
import React from 'react'

// interface

type Props = {
  isVisible: boolean
}

// function

const Waiter: React.FC<Props> = props => {

  const timer = React.useRef(0)
  const [visible, setVisible] = React.useState(0)
  React.useEffect(() => {
    if (props.isVisible) setVisible(1)
    else if (visible) {
      setVisible(2)
      if (timer.current) clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setVisible(0), 300)
    }
  }, [props.isVisible, visible])

  const html = React.useMemo(() => (
    Array(9).fill(0)
      .map((_n, i) => <div key={`item-${i}-waiter`}></div>)
  ), [])

  return (
    <>
      {
        visible
          ? (
            <div
              className={visible === 2 ? 'leaving' : ''}
              id='waiter'
            >{html}</div>
          )
          : null
      }
    </>
  )
}

// export
export default Waiter