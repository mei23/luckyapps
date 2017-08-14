const prod = process.env.NODE_ENV === 'production'

const port = process.env.PORT || 3000

const config = {
  PORT: port,
  URL: prod ? 'https://meiapps.herokuapp.com' : `http://localhost:${port}`,
}

module.exports = config
