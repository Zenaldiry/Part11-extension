const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const user = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })
  response.status(200).json(user)
})

userRouter.post('/', async (request, response) => {
  const { name, username, password } = request.body
  const userIsExisted = await User.findOne({ username })
  if (userIsExisted) {
    return response.status(400).json({ error: 'username must be unique' })
  }
  if (!username) {
    return response.status(400).json({ error: 'the usename is required' })
  } else if (username.length < 3) {
    return response
      .status(400)
      .json({ error: 'username must be 3 characters at least' })
  }
  if (!password) {
    return response.status(400).json({
      error: 'the password is required ',
    })
  } else if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'the password must be at least 3 characters' })
  }
  const saltRound = 10
  const passwordHash = await bcrypt.hash(password, saltRound)
  const user = new User({ name, username, passwordHash })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

userRouter.delete('/', async (request, response) => {
  await User.deleteMany({})
  response.status(200).send('done')
})

module.exports = userRouter
