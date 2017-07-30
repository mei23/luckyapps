import React from 'react'

class LoggedInComponent extends React.Component {
  constructor(props) {
    super()
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

  defaultState(props) {
    return {
      isLoggedIn: props.isLoggedIn,
      mastodonAuthInfo: props.mastodonAuthInfo,
    }
  }

  render = (props) => {
    if (!this.state.isLoggedIn) return null

    return this.renderChild(props)
  }

  renderChild(props) {
    throw new Error('Do not call abstract method from child.')
  }
}

export default LoggedInComponent
