const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/luckyapps', {
  useMongoClient: true
})

const config = require('./config')

const mastodonAuth = require('./api/mastodonAuth')

const U = require('./api/utils/apiUtils')

/* verify heroku config var */
if (!dev && !process.env.SESSION_SECRET)
  throw new Error('process.env.SESSION_SECRET does not specified')

app.prepare().then(() => {
  const server = express()

  server.use(function(req, res, next) {
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  })
  
  server.use(session({
    secret: dev ? 'session_secret_local' : process.env.SESSION_SECRET,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    rolling: true,
    httpOnly: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // week
  }))

  server.get('/api/mastodon/login', (req, res) => {
    const host = U.cleanHostname(req.query.host)
    if (!host) {
      res.redirect('/login')
    } else {
      req.session.tmpHost = host
      mastodonAuth.auth(host)
        .then(authUrl => res.redirect(302, authUrl))
        .catch(err => {
          console.error(err)
          res.send(err.toString())
        })
    }
  })

  // Mastodon からリダイレクトされる
  server.get('/api/mastodon/auth', (req, res) => {
    const host = req.session.tmpHost
    const authCode = req.query.code

    if (!host || !authCode) {
      res.send('<p>エラーが発生しました。もう一度やり直してください。<a href="/">戻る</a></p>')
    } else {
      mastodonAuth.getAccessToken(host, authCode)
        .then(accessToken => {
          // ホスト名とアクセストークンをセッションに保存
          req.session.mastodonAuthInfo = { host, accessToken }
          res.redirect('/')
        })
        .catch(err => {
          console.error(err)
          res.send(err.toString())
        })
    }
  })

  server.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.clearCookie()
      res.redirect('/')
    })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(config.PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${config.PORT}`)
  })
})
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
