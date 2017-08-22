import FontIcon from 'react-md/lib/FontIcons'
import Paper from 'react-md/lib/Papers'
import IconSeparator from 'react-md/lib/Helpers/IconSeparator'

import * as U from '../utils/utils'

/**
 * トゥートヘッダ部分
 */
const StatusHeaderEx = (props) => {
  const reblog = props.status.reblog ? props.status.reblog : null
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
      <div className='status-id md-text--secondary' style={{ marginRight: 'auto' }}>
        {props.status.id}
        {reblog ? (
          <span> [Boosted:&nbsp;{reblog.id}]</span>
        ) : ''}
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
      <div>
        <a href={acc.url} title={acc.display_name} target='_blank'>
          <img className='avatar'
            src={U.resolveAvatarUrl(props.host, acc.avatar)}
            style={{'width':`${size}px`, 'height':`${size}px`, 'border-radius':`${radius}px`}}
            role='presentation' />
        </a>
      </div>
      { showSts ? 
        <div className='sts-count'>
          {acc.statuses_count}
        </div> : '' } 
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
          __html: sts.content
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
      <span className='md-text--secondary' style={{margin:'0em 1em'}}>
        {sts.sensitive ? (<span>Sensitive | </span>) : ''}
        {sts.visibility}
        <span> | </span>
        {sts.application ? (<a href={sts.application.website}>{sts.application.name}</a>) : JSON.stringify(sts.application)}
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
            <StatusFooterEx status={sts} />
          </div>
        </div>
        <style jsx>{`
          .toot {
            border: solid 1px #ccc;
            border-top: 0px;
            border-right: 0px;
            border-left: 0px;
            padding: 0.2em;
            }
          .toot.muted { background: red }
        `}</style>
      </div>
    )
  }
}
