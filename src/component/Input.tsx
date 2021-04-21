import './Input.css'
import React from 'react'

// interface

type Action = 'move' | 'reset' | 'undo'

type Props = {
  emit: (name: Action, data?: unknown) => void
}

// variable

// function

// component

const Input: React.FC<Props> = props => {

  const [current, setCurrent] = React.useState('')
  React.useEffect(() => {
    if (!current) return () => null
    const timer = window.setTimeout(() => {
      setCurrent('')
    }, 500)
    return () => window.clearTimeout(timer)
  }, [current])

  const emit = (
    name: Action,
    data?: unknown,
  ) => {
    if (current) return
    props.emit(name, data)
  }

  return (
    <div id='input'>

      <div id='group-right-input'>
        <div onClick={() => emit('move', 'left')}></div>
        <div onClick={() => emit('move', 'top')}></div>
        <div onClick={() => emit('move', 'right')}></div>
        <div onClick={() => emit('move', 'bottom')}></div>
      </div>

    </div>
  )
}

// export
export type { Action }
export default Input