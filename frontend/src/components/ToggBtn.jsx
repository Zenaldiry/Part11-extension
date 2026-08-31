import { useState } from 'react'
const ToggBtn = (props) => {
  const [visible, setVisible] = useState(false)
  const btnName = visible ? props.hide : props.show
  const shownWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisible = () => {
    setVisible(!visible)
  }
  return (
    <span>
      <button onClick={toggleVisible}>{btnName}</button>
      <div style={shownWhenVisible}>{props.children}</div>
    </span>
  )
}

export default ToggBtn
