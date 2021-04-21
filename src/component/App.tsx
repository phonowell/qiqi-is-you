import './App.css'
import './Button.css'
import './Stage.css'
import Editor from './Editor'
import React from 'react'
import Toast from './Toast'
import setRem from '../function/setRem'

// component

const App: React.FC = () => {

  React.useEffect(() => {
    setRem()
  }, [])

  // toast
  const [msgToast, setMsgToast] = React.useState('')
  const showToast = (
    msg: string,
  ) => {
    setMsgToast(msg)
    setTimeout(() => setMsgToast(''), 20)
  }

  return (
    <div id='app'>
      <Toast message={msgToast}></Toast>
      <Editor
        showToast={showToast}
      ></Editor>
    </div>
  )
}

// export
export default App