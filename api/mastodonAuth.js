const Masto = require('mastodon-api')
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
      return Masto.getAuthorizationUrl(
        mastodonApp.client_id,
        mastodonApp.client_secret,
        'https://' + hostname,
        SCOPES,
        REDIRECT_URL
      )
    })
}

const createApp = (hostname) => {
  // OAuth create app API を呼ぶ
  return Masto.createOAuthApp(
    'https://' + hostname + '/api/v1/apps',
    APP_NAME,
    SCOPES,
    REDIRECT_URL
  ).then(oauthRes => {
    // 返ってきた OAuth result を DB に保存
    return new MastodonApp({
      hostname: hostname,
      id: oauthRes.id,
      client_id: oauthRes.client_id,
      client_secret: oauthRes.client_secret,
    })
  }).then((mastodonApp) => mastodonApp.save())
    .then((err, mastodonApp) => {
      if (err) throw err
      // 次の処理で使用する
      return mastodonApp
    })
}

const getAccessToken = (hostname, authCode) => {
  const baseUrl = 'https://' + hostname

  return findMastodonApp(hostname)
    .then((mastodonApps) => {
      if (mastodonApps.length < 1) {
        throw new Error('no MastodonApp record found')
      }
      return mastodonApps[0]
    }).then((mastodonApp) => {
      return Masto.getAccessToken(
        mastodonApp.client_id,
        mastodonApp.client_secret,
        authCode,
        baseUrl,
        REDIRECT_URL
      )
    })
}

module.exports = { auth, getAccessToken }
