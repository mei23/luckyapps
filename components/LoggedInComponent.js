import React from 'react'

import AccountSmall from '../components/AccountSmall'

export default class extends React.Component {
  constructor(props) {
    super()

    this.state = {
      isLoggedIn: props.isLoggedIn,
      mastodonAuthInfo: props.mastodonAuthInfo,
      selfAccount: null,
    }
  }

  static ensureLoggedIn(ctx) {
    if (!ctx.req) {
      document.location.pathname = '/'
      return { isLoggedIn: false }
    }

    const { mastodonAuthInfo } = ctx.req.session

    if (!mastodonAuthInfo) {
      ctx.res.redirect('/login')
      return { isLoggedIn: false }
    }

    return { isLoggedIn: true, mastodonAuthInfo }
  }

  getSelfAccountSmall(host) {
    this.M = new Mastodon(
      this.state.mastodonAuthInfo.accessToken,
      this.state.mastodonAuthInfo.host)

    this.M.get('/api/v1/accounts/verify_credentials')
      .then(act => (
        <AccountSmall
          account={act}
          host={this.state.mastodonAuthInfo.host} />
      ))
  }

  render = (props) => {
    if (!this.state.isLoggedIn) return null

    return this.renderChild(props)
  }

  renderChild(props) {
    throw new Error('Do not call abstract method from child.')
  }
}
