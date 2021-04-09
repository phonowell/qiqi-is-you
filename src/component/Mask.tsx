import './Mask.css'
import Alert from './Alert'
import React from 'react'

// interface

type Props = {
  data: unknown
  name: string
  setData: (value: unknown) => void
  setName: (value: string) => void
}

// function

const Mask: React.FC<Props> = props => {

  const timer = React.useRef(0)
  const [name, setName] = React.useState('')
  const [visible, setVisible] = React.useState(0)
  React.useEffect(() => {
    if (props.name) {
      setName(props.name)
      setVisible(1)
    } else if (visible) {
      setVisible(2)
      if (timer.current) clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setName('')
        setVisible(0)
      }, 300)
    }
  }, [props.name, visible])

  return (
    <>
      {
        visible
          ? <div
            className={visible === 2 ? 'leaving' : ''}
            id='mask'
          >

            {
              name === 'alert'
                ? <Alert
                  message={props.data as string}
                  setNameMask={props.setName}
                ></Alert>
                : null
            }

          </div>
          : null
      }
    </>
  )
}

// export
export default Mask