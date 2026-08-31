const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const errorInfo = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

const loggersObj = { info, errorInfo }
module.exports = loggersObj
