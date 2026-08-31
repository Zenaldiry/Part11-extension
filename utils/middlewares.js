const { info, errorInfo } = require('../utils/loggers')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const requestLoggers = (request, response, next) => {
  info('METHOD', request.method)
  info('PATH', request.path)
  info('BODY', request.body)
  info('..................................')
  next()
}

const errorHandler = (error, request, response, next) => {
  errorInfo(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error collection')
  ) {
    return response
      .status(400)
      .json({ error: 'the username should be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  if (
    request.headers['authorization'] &&
    request.headers['authorization'].includes('Bearer ')
  ) {
    request.token = request.headers['authorization'].replace('Bearer ', '')
    request.token
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(400).json({ error: 'invalid token' })
  }
  request.user = await User.findById(decodedToken.id)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const middlewaresObj = {
  requestLoggers,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
module.exports = middlewaresObj
