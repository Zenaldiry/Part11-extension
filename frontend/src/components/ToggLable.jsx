import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
const ToggLable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)
  const shownWhenVisible = { display: visible ? '' : 'none' }
  const hiddenWhenVisible = { display: visible ? 'none' : '' }
  const toggleVisible = () => {
    setVisible(!visible)
  }
  useImperativeHandle(refs, () => {
    return {
      toggleVisible,
    }
  })
  return (
    <div>
      <button style={hiddenWhenVisible} onClick={toggleVisible}>
        {props.buttonLable}
      </button>
      <div style={shownWhenVisible}>
        {props.children}
        <button onClick={toggleVisible}>cancel</button>
      </div>
    </div>
  )
})
ToggLable.propTypes = {
  buttonLable: PropTypes.string.isRequired,
}
ToggLable.displayName = 'ToggLable'

export default ToggLable
