const { PORT } = require('./utils/config')
const app = require('./app')
const { info } = require('./utils/loggers')

app.listen(PORT, () => {
  info(`listening to port ${PORT}`)
})
