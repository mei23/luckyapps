import Head from 'next/head'

import List from 'react-md/lib/Lists/List'
import Subheader from 'react-md/lib/Subheaders'

import AccountSmall from '../components/AccountSmall'
import Layout from '../components/Layout'

import LoggedInComponent from '../components/LoggedInComponent'

import Mastodon from 'mstdn-api'

class Index extends LoggedInComponent {
  constructor(props) {
    super()

    this.state = this.defaultState(props)
    this.state.selfAccount = null
  }

  static getInitialProps(ctx) {
    return LoggedInComponent.ensureLoggedIn(ctx)
  }

  componentDidMount() {
    const M = new Mastodon(
      this.state.mastodonAuthInfo.accessToken,
      this.state.mastodonAuthInfo.host)

    M.get('/api/v1/accounts/verify_credentials')
      .then(act => (<AccountSmall account={act} host={this.state.mastodonAuthInfo.host} />))
      .then(actSmall => {
        this.setState({ selfAccount: actSmall })
      })
      .catch(e => console.error(e))
  }

  renderChild(props) {
    return (
      <Layout>
        <List className="md-cell md-cell--12 md-paper md-paper--1">
          <Subheader primaryText="Your Account" />
          {this.state.selfAccount}
        </List>
        <dl>
          <dt><a href='/birdkiller'>BirdKiller</a></dt>
          <dd>鳥を燃やすウェブサービスです。</dd>
          <dt><a href='/ltlstat'>LTL Stat</a></dt>
          <dd>LTL Stat</dd>
          <dt><a href='/staticstat'>Static Stat</a></dt>
          <dd>Static Stat</dd>
        </dl>
      </Layout>
    )
  }
}

export default Index
