const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { info, errorInfo } = require('./utils/loggers')
const {
  requestLoggers,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middlewares')
const path = require('path')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const { URI } = require('./utils/config')
app.use(express.json())
app.use(express.static(path.join(__dirname, 'frontend/dist')))
app.use(requestLoggers)

mongoose.set('strictQuery', false)
info('connecting to MONGODB')
try {
  mongoose.connect(URI)
  info('connected to MONGODB')
} catch (error) {
  errorInfo(error)
}

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
