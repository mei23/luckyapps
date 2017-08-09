const Mastodon = require('mstdn-api').default
const config = require('../config')
const fs = require('fs')

const MastodonApp = require('./models/mastodonApp')

const APP_NAME = 'LuckyApps'
const SCOPES = 'read write follow'
const REDIRECT_URL = config.URL + '/api/mastodon/auth'

const findMastodonApp = (hostname) => {
  return MastodonApp.find({ hostname }).exec()
}

const auth = (hostname) => {
  return findMastodonApp(hostname)
    .then((mastodonApps) => {
      // DB に無い場合は create する
      if (mastodonApps.length < 1) {
        console.log(`hostname: ${hostname} が DB に見つからないため、 createApp を実行`)
        return createApp(hostname)
      }
      return mastodonApps[0]
    }).then((mastodonApp) => {
      return Mastodon.generateAuthUrl(
        mastodonApp.client_id, {
          redirect_uri: REDIRECT_URL,
          scopes: Mastodon.Scope.DEFAULT,
        },
        hostname
      )
    })
}

const createApp = (hostname) => {
  // OAuth create app API を呼ぶ
  return Mastodon.registerApp(
    APP_NAME, {
      redirect_uris: REDIRECT_URL,
      scopes: Mastodon.Scope.DEFAULT,
      website: config.URL,
    },
    hostname
  ).then(appData => {
    // 返ってきた appData を DB に保存
    return new MastodonApp({
      hostname: hostname,
      id: appData.id,
      client_id: appData.clientId,
      client_secret: appData.clientSecret,
    })
  }).then((mastodonApp) => mastodonApp.save())
    .then((err, mastodonApp) => {
      if (err) throw err
      // 次の処理で使用する
      return mastodonApp
    })
}

const getAccessToken = (hostname, authCode) => {
  return findMastodonApp(hostname)
    .then((mastodonApps) => {
      if (mastodonApps.length < 1) {
        throw new Error('no MastodonApp record found')
      }
      return mastodonApps[0]
    }).then((mastodonApp) => {
      return Mastodon.fetchAccessToken(
        mastodonApp.client_id,
        mastodonApp.client_secret,
        authCode,
        REDIRECT_URL,
        hostname,
      )
    }).then(tokenData => tokenData.accessToken)
}

module.exports = { auth, getAccessToken }
