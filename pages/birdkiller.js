import Link from 'next/link'

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

import Mastodon from 'mstdn-api'

const DEFAULT_MUTE_TARGET_REGEX = '^(sync\\.twi2mstdn\\.space)$'

export default class extends LoggedInComponent {
  constructor(props) {
    super(props)

    this.state = this.defaultState(props)
    this.state.selfAccount = null
    this.state.toots = []
    this.state.muteMode = false
    this.state.mutedCount = 0
    this.state.muteTargetRegex = DEFAULT_MUTE_TARGET_REGEX
    this.state.muteTargetRegexChanged = DEFAULT_MUTE_TARGET_REGEX

    this.toggleMuteMode = this.toggleMuteMode.bind(this)
    this.handleRegexChange = this.handleRegexChange.bind(this)
    this.handleRegexApply = this.handleRegexApply.bind(this)
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
          isMuteTarget: appName.match(this.state.muteTargetRegex),
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

  handleRegexChange(e) {
    this.setState({ muteTargetRegexChanged: e })
  }

  handleRegexApply(e) {
    this.setState({ muteTargetRegex: this.state.muteTargetRegexChanged })
  }

  renderChild(props) {
    return (
      <Layout title='BirdKiller'>
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
            className='md-cell md-cell--6'
            onChange={this.toggleMuteMode}
          />
        </div>
        <div className='md-grid'>
          <TextField
            id='muteTargetRegex'
            label='ミュート対象クライアント (正規表現)'
            placeholder={DEFAULT_MUTE_TARGET_REGEX}
            size={10}
            className='md-cell '
            defaultValue={DEFAULT_MUTE_TARGET_REGEX}
            onChange={this.handleRegexChange}
          />
          <Button raised primary
            label='適用'
            className='md-cell md-cell--middle'
            onClick={this.handleRegexApply}
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
