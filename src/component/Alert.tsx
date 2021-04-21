import './Alert.css'
import React from 'react'

// interface

type Props = {
  message: string
  setMask: (input: string) => void
  yes?: string
}

// variable

// function

const Alert: React.FC<Props> = props => {

  const [listMessage, setListMessage] = React.useState<string[]>([])
  const [textYes, setTextYes] = React.useState('确定')

  React.useEffect(() => {
    setListMessage(props.message.split('\n'))
  }, [props.message])

  React.useEffect(() => {
    setTextYes(props.yes || '确定')
  }, [props.yes])

  const close = () => props.setMask('')

  return (
    <div
      className='float'
      id='alert'
    >

      <div className='container'>
        <div className='message'>
          {listMessage.map((msg, i) => <p key={`${i}:${msg}`}>{msg}</p>)}
        </div>
      </div>

      <div className='toolkit'>
        <div
          className='btn btn-toolkit'
          onClick={close}
        >{textYes}</div>
      </div>

    </div>
  )
}

// export
export default Alert