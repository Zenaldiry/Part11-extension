require('dotenv').config()
const PORT = process.env.PORT
const URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
const SECRET = process.env.SECRET

const configObj = { PORT, URI, SECRET }

module.exports = configObj
