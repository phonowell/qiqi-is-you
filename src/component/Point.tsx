import './Point.css'
import React from 'react'

// interface

type Props = {
  coordinate: [number, number]
}

// function

const Point: React.FC<Props> = props => {

  const timer = React.useRef(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const [style, setStyle] = React.useState<React.CSSProperties>({})
  React.useEffect(() => {
    const transform = `translate(${props.coordinate[0]}px, ${props.coordinate[1]}px)`
    setStyle({ transform })

    setIsVisible(true)

    if (timer.current) clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }, [props.coordinate])

  return (
    <div
      id='point'
      className={isVisible ? 'visible' : undefined}
      style={style}
    ></div>
  )
}

// export
export default Point