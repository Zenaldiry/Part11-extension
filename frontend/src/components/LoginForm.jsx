import login from '../services/login'
import { useState } from 'react'
import PropTypes from 'prop-types'
import ToggLable from './ToggLable'
const LoginForm = ({ setUser, setNotification, setColor }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleUsername = (e) => {
    setUsername(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await login({
        username,
        password,
      })
      setUser(data)
      setPassword('')
      setUsername('')
      setNotification(`${data.name} logged In`)
      setColor(true)
      setTimeout(() => {
        setNotification('')
      }, 2000)
    } catch (error) {
      setNotification('invalid username or password')
      setColor(false)
      setTimeout(() => {
        setNotification('')
        setColor(true)
      }, 2000)
    }
  }
  return (
    <ToggLable buttonLable="login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label htmlFor="username">username</label>
          <input
            onChange={handleUsername}
            value={username}
            name="username"
            id="username"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            onChange={handlePassword}
            value={password}
            name="password"
            id="password"
            type="password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </ToggLable>
  )
}
LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired,
}

export default LoginForm
