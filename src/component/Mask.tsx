import './Mask.css'
import $blockScroll from '../function/blockScroll'
import Alert from './Alert'
import React from 'react'

// interface

type DataMask = {
  callback?: (input?: unknown) => void
  data?: unknown
  name: string
}

type Props = {
  mask: DataMask
  setMask: SetMask
}

type SetMask = (input: DataMask | string) => void

// function

const Mask: React.FC<Props> = props => {

  const { callback, data, name } = props.mask
  const { setMask } = props

  const [visible, setVisible] = React.useState(0)
  React.useEffect(() => {

    const clean = () => null

    if (name) {
      setVisible(1)
      return clean
    }

    if (visible) {
      setVisible(2)
      const timer = window.setTimeout(() => {
        setMask({ name: '' })
        setVisible(0)
      }, 300)
      return () => window.clearTimeout(timer)
    }

    return clean
  }, [name, setMask, visible])

  React.useEffect(() => {
    $blockScroll(!!visible)
  }, [visible])

  const clickBack = (
    e: React.MouseEvent,
  ) => {
    if (!callback) return
    if ((e.target as Element).id !== 'mask') return
    callback(data)
  }

  return (
    <>{visible && <div
      className={visible === 2 ? 'leaving' : ''}
      id='mask'
      onClick={clickBack}
    >

      {name === 'alert' && <Alert
        message={data as string}
        setMask={setMask}
      ></Alert>}

    </div>}</>
  )
}

const useMask = (
  defaultValue: DataMask,
): [DataMask, SetMask] => {

  const [data, setData] = React.useState(defaultValue)

  const setMask = React.useCallback((
    input: DataMask | string,
  ) => {
    typeof input === 'string'
      ? setData({ name: input })
      : setData(input)
  }, [])

  return [data, setMask]
}

// export
export { useMask }
export default Mask