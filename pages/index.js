import Link from 'next/link'
import Head from 'next/head'

import List from 'react-md/lib/Lists/List'
import Subheader from 'react-md/lib/Subheaders'
import Paper from 'react-md/lib/Papers'
import Switch from 'react-md/lib/SelectionControls/Switch'
import TextField from 'react-md/lib/TextFields'
import Button from 'react-md/lib/Buttons/Button'

import AccountSmall from '../components/AccountSmall'
import Layout from '../components/Layout'
import Status from '../components/Status'

import LoggedInComponent from '../components/LoggedInComponent'
import Credits from '../components/Credits'

const DEFAULT_MUTE_TARGET_REGEX = '^(sync\\.twi2mstdn\\.space)$'

export default class extends LoggedInComponent {
  constructor(props) {
    super(props)
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
  }

  renderChild(props) {
    return (
      <Layout>
        <Head>
          {/* load Onsen script */}
          <script src="/static/mastodon-api.min.js"></script>
        </Head>
        <List className="md-cell md-cell--12 md-paper md-paper--1">
          <Subheader primaryText="Your Account" />
          {this.state.selfAccount}
        </List>

        <ul>
          <li>
            <a href='/birdkiller'>BirdKiller</a>
            <ul><li>
              鳥を燃やすウェブサービスです。
            </li></ul>
          </li>
          <li>TootViewer</li>
        </ul>
      </Layout>
    )
  }
}
