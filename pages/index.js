import Link from 'next/link'
import Router from 'next/router'
import Head from 'next/head'

import List from 'react-md/lib/Lists/List'
import Subheader from 'react-md/lib/Subheaders'
import Paper from 'react-md/lib/Papers'
import Switch from 'react-md/lib/SelectionControls/Switch'
import Button from 'react-md/lib/Buttons/Button'
import Collapse from 'react-md/lib/Helpers/Collapse'

import AccountSmall from '../components/AccountSmall'
import Layout from '../components/Layout'
import Status from '../components/Status'

import LoggedInComponent from '../components/LoggedInComponent'

class Index extends LoggedInComponent {
  constructor(props) {
    super()

    const state = this.defaultState(props)
    state.selfAccount = null
    state.toots = []
    state.muteMode = false
    state.mutedCount = 0
    this.state = state

    if (!this.state.isLoggedIn) return

    this.toggleMuteMode = this.toggleMuteMode.bind(this)
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

    const listener = M.stream('public/local')
      .on('update', status => {
        const appName = status.application.name

        const toot = {
          status,
          isMuteTarget: appName === 'sync.twi2mstdn.space',
          muted: false,
        }

        const newToots = [toot].concat(this.state.toots.slice(0, 100))
        this.setState({ toots: newToots })

        if (this.state.muteMode && toot.isMuteTarget)
          listener.emit('mute', status.account)
      })
      .on('mute', (account) => {
        console.log('鳥だ燃やせ！！！！！ ' + account.acct)
        M.post(`accounts/${account.id}/mute`)
          .then(() => {
            new Audio('/static/powerdown07_pitchup.mp3').play()
            console.log(`${account.acct} was muted.`)
            this.setState({ mutedCount: this.state.mutedCount + 1 })
          })
      })
      .on('error', err => console.error(err))
  }

  toggleMuteMode(isEnabled) {
    this.setState({ muteMode: isEnabled })
  }

  renderChild(props) {
    return (
      <Layout title='BirdKiller'>
        <Head>
          {/* load Onsen script */}
          <script src="/static/mastodon-api.min.js"></script>
        </Head>
        <List className="md-cell md-cell--12 md-paper md-paper--1">
          <Subheader primaryText="Your Account" />
          {this.state.selfAccount}
        </List>

        <div className='paper-container md-grid'>
          <Paper className='' zDepth={3} style={{ padding: '10px', margin: '20px' }}>
            <p>BirdKiller は、クライアント名が「sync.twi2mstdn.space」なトゥートのアカウントを LTL から抽出し、ミュートするサービスです。</p>
            <p>赤いトゥートはミュート対象のものです。</p>
            <p>「鳥を燃やすモード」をオンにすると、ミュートを実行します。</p>
          </Paper>
        </div>

        <Credits />

        <div className='md-grid'>
          <Switch
            id='muteMode'
            label='鳥を燃やすモード'
            name='muteMode'
            className='md-cell'
            onChange={this.toggleMuteMode}
          />
        </div>

        <p>ミュートした件数: {this.state.mutedCount}</p>

        {this.state.toots.map(toot => (
          <Status key={toot.status.id}
            host={this.state.mastodonAuthInfo.host}
            status={toot.status}
            isMuteTarget={toot.isMuteTarget} />
        ))}
      </Layout>
    )
  }
}

class Credits extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = { collapsed: true }
    this._toggleCollapse = this._toggleCollapse.bind(this)
  }

  _toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    return (
      <div>
        <Button raised label='クレジット情報' onClick={this._toggleCollapse} style={{ marginBottom: 16 }} />
        <Collapse collapsed={this.state.collapsed}>
          <ul>
            <li>開発: <a href='https://mstdn.jp/@the_boss'>@the_boss@mstdn.jp</a> (問題のご報告はこちらへ)</li>
            <li>ライブラリ提供: <a href='https://mstdn.jp/@tobikame'>@tobikame@mstdn.jp</a></li>
            <li>サウンド素材: <a href='http://taira-komori.jpn.org/'>無料効果音で遊ぼう！</a></li>
          </ul>
        </Collapse>
      </div>
    );
  }
}

export default Index
