import FontIcon from 'react-md/lib/FontIcons'
import Paper from 'react-md/lib/Papers'
import IconSeparator from 'react-md/lib/Helpers/IconSeparator'

import UserIcon from '../components/UserIcon'

import * as U from '../utils/utils'

/**
 * トゥートヘッダ部分
 */

 /*
 <span className='md-text--secondary' style={{margin:'0em 1em'}}>
        {sts.sensitive ? (<span>Sensitive | </span>) : ''}
        {sts.visibility}
        <span> | </span>
        {sts.application ? (<a href={sts.application.website}>{sts.application.name}</a>) : JSON.stringify(sts.application)}
      </span>*/

const StatusHeaderEx = (props) => {
  const reblog = props.status.reblog ? props.status.reblog : null

  const statusTime = new Date(props.status.created_at).getTime()
  const arriveTime = props.status._arriveDate 
    ? props.status._arriveDate.getTime() :new Date().getTime()
  const delay = Math.floor((arriveTime - statusTime)/1000)

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
      <div className='status-id md-text--secondary' style={{ marginRight: 'auto' }}>
        <span>{props.status.id}</span>
        {reblog ? (
          <span>[Boosted:&nbsp;{reblog.id}]</span>
        ) : ''}
        {props.status.sensitive ? (<span> / Sensitive</span>) : ''}
        <span> / {props.status.visibility}</span>
        <span> / delay:{delay}s</span>
        <span> / {props.status.application 
          ? (<a href={props.status.application.website}>{props.status.application.name}</a>) 
          : JSON.stringify(props.status.application)}</span>
      </div>
      <div className='status-time md-text--secondary' style={{ textAlign: 'right' }}>
        <a href={props.status.url}>{U.formatLocaleString(props.status.created_at, 'm/d H:MM:ss.l')}</a>
        {reblog ? (
          <span> [Original:&nbsp;<a href={reblog.url}>{U.toLocaleString(reblog.created_at)}</a>]</span>
        ) : ''}
      </div>
      
    </div>
  )
}

const AttachedMediaEx = (props) => (
  <div>
    {props.mediaAttachments.map(att => (
      <span key={att.id}>
        <a href={att.url}>
          {att.type === 'image' || att.type === 'gifv'
            ? (<img src={att.preview_url} className='att-image' />)
            : att.type === 'video' ?
              (<video src={att.url} className='att-video' />)
              : ''
          }
        </a>
      </span>
    ))}
    <style jsx>{`
      .att-image { max-width: 100%; max-height: 110px }
      .att-video { max-width: 100%; max-height: 110px }
    `}</style>
  </div>
)

// account object
// https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#account




const AvatarBox = (props) => {
  const acc = props.account
  const size = props.size > 0 ? props.size : 48
  const radius = Math.floor(size/12)
  const showSts = props.showSts
  
  return (
    <div className='avatar-box' style={{'width':`${size}px`}}>
      <UserIcon host={props.host} account={acc}
        text={showSts? acc.statuses_count : ''}
        size={48} radius_ifactar={12} anim={0} duration={-1} />
        <style jsx>{`
          .sts-count { text-align: right; padding: 0px; margin: 0px; }
          :global(.shinki) .avatar { border: solid 3px green; }
          :global(.rougai) .avatar { border: solid 3px orange; }
        `}</style>
    </div>

  )
}


const StatusBodyEx = (props) => {
  const sts = props.status
  let c = sts.content
  c = c.replace(/^<p>/, '')
  c = c.replace(/<\/p>$/, '')
  c = c.replace(/<script/i, '&lt;script')
  
  return (
    <div>
      <div>
        <div>
          <span className='md-text'>
            {sts.account.display_name}
          </span>
          <span> </span>
          <span className='md-text--secondary'>
            @{sts.account.acct}
          </span> <span className='account_registed md-text--secondary'>
            [{U.toRelactiveString(sts.account.created_at)} 
            ({U.formatLocaleString(sts.account.created_at, 'yyyy/m/d H:MM')})]
          </span>
        </div>
        {sts.spoiler_text ? (
          <div className='md-text'>[CW: {sts.spoiler_text}]</div>
        ) : ''}
        <div className='md-text' dangerouslySetInnerHTML={{
          __html: c
        }} />
        {sts.media_attachments.length > 0 ?
          <AttachedMediaEx mediaAttachments={sts.media_attachments} /> : ''}
      </div>
      <style jsx>{`
        :global(.shinki) .account_registed { background: #cfc; }
        :global(.rougai) .account_registed { background: #fec; }
      `}</style>
    </div>
  )
}

const StatusFooterEx = (props) => {
  const sts = props.status
  return (
    <div>
      <span className='md-text--secondary' style={{margin:'0em 0.5em'}}>
        🔃 {sts.reblogs_count}
      </span>
      <span className='md-text--secondary' style={{margin:'0em 0.5em'}}>
        ★ {sts.favourites_count}
      </span>
    </div>
  )
}

export default class StatusEx extends React.Component {
  constructor(props) {
    super()
    this.state = {
      status: props.status,
    }
  }

  render() {
    const sts = this.state.status.reblog ? this.state.status.reblog : this.state.status

    // 新規？ 熟練？
    const secAfterRegist = (new Date() - new Date(sts.account.created_at)) / 1000
    const shinki = secAfterRegist < 86400 *  7 // 新規さん
    const rougai = false

    return (
      <div>
        <div style={{ display: 'flex' }} 
          className={'toot' 
            + (shinki ? ' shinki' : '')
            + (rougai ? ' rougai' : '')
            + (this.props.isMuteTarget ? ' muted' : '')
        }>
          <div style={{ margin:'0.3em'}}>
            <AvatarBox account={sts.account} host={this.props.host} size='48' showSts='1' />
          </div>
          <div style={{ margin:'0.3em', width:'100%'}}>
            <StatusHeaderEx status={this.state.status} />
            <StatusBodyEx host={this.props.host} status={sts}/>
            
          </div>
        </div>
        <style jsx>{`
          .toot {
            border: solid 1px #ccc;
            border-top: 0px;
            border-right: 0px;
            border-left: 0px;
            padding: 0.2em;
            animation-duration: 5s;
            animation-name: alived;
            animation-timing-function: linear;
          }
          .toot.muted { background: red }
          @keyframes alived {
            0% {
              background: #ddf;
            }
            100% {
              background: #ddf;
            }
          }
        `}</style>
      </div>
    )
  }
}
