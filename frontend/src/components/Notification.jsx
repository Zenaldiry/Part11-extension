import PropTypes from 'prop-types'
const Notification = ({ notification, color }) => {
  const green = {
    color: 'green',
    backgroundColor: '#eee',
    border: 'solid 2px green',
    padding: '20px',
    fontSize: '20px',
  }
  const red = {
    color: 'red',
    backgroundColor: '#eee',
    border: 'solid 2px red',
    padding: '20px',
    fontSize: '20px',
  }
  const style = color === true ? green : red
  return <div style={style}>{notification}</div>
}

Notification.propTypes = {
  notification: PropTypes.string.isRequired,
  color: PropTypes.bool.isRequired,
}

export default Notification
