const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })

  const userNotExist = user === null ? true : false
  if (userNotExist) {
    return response.status(401).json({ error: 'invalid username or password' })
  }
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' })
  }
  const userToGetToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userToGetToken, process.env.SECRET)

  response.status(200).send({
    name: user.name,
    username: user.username,
    token,
  })
})

module.exports = loginRouter
