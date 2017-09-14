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
import StatusEx from '../components/StatusEx'

import LoggedInComponent from '../components/LoggedInComponent'
import Credits from '../components/Credits'

import AccountList from '../components/AccountList'
import FeraList from '../components/FeraList'

import Mastodon from 'mstdn-api'

const StatusStat = require('../utils/StatusStat.js')
const FeraDelay = require('../utils/FeraDelay.js')

export default class extends LoggedInComponent {
  constructor(props) {
    super(props)

    this.state = this.defaultState(props)
    this.state.selfAccount = null
    this.state.toots = []

    this.state.lastIState = -1
    this.state.c1 = -1
    this.state.c2 = -1
    this.state.velo = -1

    // スイッチの初期状態
    this.state.pendDisp = false
    this.state.noDisp = false

    // 統計オブジェクト  アクティブユーザー集計用
    // 5分以内に出現を集計だと過疎っぷりが際立つので、10分間隔で集計＆更新
    // でも、最初なかなか人出てこないのも寂しいので、最初の10分は認知順にリアルタイム更新
    this.st10 = new StatusStat(10 * 60 * 1000)
    this.st5 = new StatusStat(5 * 60 * 1000)
    //this.fd = new FeraDelay(10)
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

    const listener = M.stream('public')
      .on('update', status => {
        // status update
        
        // インスタンスの最終 status.id 更新
        this.setState({ lastIState: status.id })

        const isNewPeriod   = this.st5.pushStatus(status)
        const isNewPeriod10 = this.st10.pushStatus(status)
        this.st5.pushStatus(status)
        //this.fd.pushStatus(status)

        this.setState({c1: this.st5.count})
        this.setState({velo: this.st5.tootPerMin})

        status._arriveDate = new Date()

        // 表示しない でない限りトゥート一覧更新
        if (!this.state.noDisp) {
          const toot = {
            status,
            hidden: this.state.pendDisp,  // 非表示フラグ
            event: 'update',
          }
          const newToots = [toot].concat(this.state.toots).slice(0, 50)
          this.setState({ toots: newToots })
        }
      })
      .on('delete', status => {
        const toot = {
          status,
          event: 'delete',
        }
        const newToots = [toot].concat(this.state.toots).slice(0, 50)
        this.setState({ toots: newToots })
      })
      .on('notification', status => {
        const toot = {
          status,
          event: 'notification',
        }
        //const newToots = [toot].concat(this.state.toots).slice(0, 50)
        //this.setState({ toots: newToots })
      })
      .on('error', err => console.error(err))
  }

  /**
   * 表示保留スイッチ切り替えイベント
   */
  _togglePendDisp = (checked) => {
    this.setState({ pendDisp: checked })
    
    if (checked) {
      // 保留状態にした時、ダミートゥートpendを入れる
      const dummyToot = { event: 'pend' } 
      let newToots = this.state.toots
      newToots.unshift(dummyToot)
      this.setState({ toots: newToots })
    }
    else {
      // 保留解除したら、保留フラグ全リセット
      this.state.toots.forEach(toot => { toot.hidden = false })
    }
  }

  renderChild(props) {
    return (
      <Layout title='LTL Stat'>
        <Head>
          <base target='_blank' />
        </Head>
        <List className="md-cell md-cell--12 md-paper md-paper--1">
          <Subheader primaryText="Your Account" />
          {this.state.selfAccount}
        </List>

        <Credits />
        {/* スイッチボックス */}
        <div style={{ display: 'flex' }}>
          <Switch id='pendDisp' name='pendDisp' label='表示保留'
            checked={this.state.pendDisp}
            onChange={this._togglePendDisp}
          />

          <Switch id='noDisp' name='noDisp' label='表示しない'
            checked={this.state.noDisp}
            onChange={x => this.setState({ noDisp: x })}
          />
        </div>
        {/*
        <FeraList inss={this.fd.Stat} />
        */}

        <div>
          <span>toot in 集計区間: {this.state.c1}</span> / <span>
            最終status.id: {this.state.lastIState}</span>
        </div>
        <div>流速: { Math.floor(this.state.velo*10)/10 } トゥート/分</div>
        <div>↓{this.st10.periodCommitCount == 0 ? 'まだ集計中（正確な値は10分待ってね)' : '10分ごとに更新中'}</div>
        <AccountList users={this.st10.activeUsers} />

        {this.state.toots
          .filter(x => !x.hidden) // 非表示のぞく
          .map(toot => (
            toot.event == 'pend' ? (<div style={{background:'yellow'}}>表示保留しました</div>) : 
            toot.event == 'delete' ? (<div style={{background:'red'}}>delete {toot.status}</div>) : 
            toot.event == 'notification' ? (<div style={{background:'notification'}}>{JSON.stringify(toot.status)}</div>) : 
          <StatusEx key={toot.status.id}
            host={this.state.mastodonAuthInfo.host}
            status={toot.status}
          />
        ))}
      </Layout>
    )
  }
}
