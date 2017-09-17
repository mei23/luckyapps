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

import StatusList from '../components/StatusList'

import Mastodon from 'mstdn-api'

export default class extends LoggedInComponent {
  constructor(props) {
    super(props)

    this.state = this.defaultState(props)
    this.state.selfAccount = null

    this.state.showStxsLocal = []
    this.state.showStxsHome = []
    this.state.showStxsMerged = []
    this.state.t1 = []
    // 受信済み StatusX list - local
    this.stxsLocal = []
    // 受信済み StatusX list - home
    this.stxsUser = []
  }

  static getInitialProps(ctx) {
    return LoggedInComponent.ensureLoggedIn(ctx)
  }

  _updateStx() {
    // merge
    let homeUpdateStxs = this.stxsUser
      .filter(x => x.event == 'update')
      .sort((a,b) => b.status.id - a.status.id)
      .filter(x => !x.status.reblogged) // きいてない？
    
    let localUpdateStxs = this.stxsLocal
      .filter(x => x.event == 'update')
      .sort((a,b) => b.status.id - a.status.id)
      .filter(x => !x.status.reblogged) // きいてない？

    //let mergedStxs = localUpdateStxs.concat(homeUpdateStxs)
    let mergedStxs = localUpdateStxs.concat(homeUpdateStxs)
    const tmp = {}
    mergedStxs = mergedStxs
      .sort((a,b) => b.status.id - a.status.id)
      .reduce((p,c) => {
        const k = c.status.id
        if (tmp[k]) return p
        tmp[k] = true
        return p.concat(c)
      }, [])
      
    this.setState({ showStxsLocal: localUpdateStxs })
    this.setState({ showStxsHome: homeUpdateStxs })
    this.setState({ showStxsMerged: mergedStxs })
  }

  componentDidMount() {
    // mstdn-api: https://rawgit.com/onsen-ui/mstdn/master/docs/classes/_mastodon_.mastodon.html

    const M = new Mastodon(
      this.state.mastodonAuthInfo.accessToken,
      this.state.mastodonAuthInfo.host)

    M.get('/api/v1/accounts/verify_credentials')
      .then(act => (<AccountSmall account={act} host={this.state.mastodonAuthInfo.host} />))
      .then(actSmall => {
        this.setState({ selfAccount: actSmall })
      })
    
    // https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#timelines
    M.get('/api/v1/timelines/public', { local: true, })
      .then(statuss => {
        this.stxsLocal = statuss.map(status => ({ event: 'update', status, }) )
        this._updateStx()
      })
    M.get('/api/v1/timelines/home')
      .then(statuss => {
        //this.setState({t1: statuss})
        this.stxsUser = statuss.map(status => ({ event: 'update', status, }) )
        this._updateStx()
      })
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
        <div>{JSON.stringify(this.state.t1)}</div>

        <div style={{ display: 'flex', flexWrap: 'wrap', }}>
          <div style={{overflow: 'scroll', 'height': '800px', width: '600px'}}>
            local
            <StatusList stxs={this.state.showStxsLocal.slice(0, 10)} />
          </div>
          <div style={{overflow: 'scroll', 'height': '800px', width: '600px'}}>
            local + home
            <StatusList stxs={this.state.showStxsMerged.slice(0, 10)} />
          </div>
          <div style={{overflow: 'scroll', 'height': '800px', width: '600px'}}>
            home
            <StatusList stxs={this.state.showStxsHome.slice(0, 10)} />
          </div>
        </div>
      </Layout>
    )
  }
}
