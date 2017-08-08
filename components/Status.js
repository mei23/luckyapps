import FontIcon from 'react-md/lib/FontIcons'
import Paper from 'react-md/lib/Papers'
import IconSeparator from 'react-md/lib/Helpers/IconSeparator'

import * as U from '../utils/utils'

const StatusHeader = (props) => {
  const reblog = props.status.reblog ? props.status.reblog : null
  return (
    <div className='md-grid md-grid--no-spacing'>
      <span className='md-cell md-cell--6 md-cell--3-tablet md-cell--1-phone md-text--secondary'>
        {props.status.id}
        {reblog ? (
          <span> [Boosted:&nbsp;{reblog.id}]</span>
        ) : ''}
      </span>
      <span className='md-cell md-cell--6 md-cell--5-tablet md-cell--3-phone md-cell--right md-text--secondary'
        style={{ textAlign: 'right' }}>
        <a href={props.status.url}>{U.formatLocaleString(props.status.created_at, 'm/d H:MM:ss.l')}</a>
        {reblog ? (
          <span> [Original:&nbsp;<a href={reblog.url}>{U.formatLocaleString(props.status.created_at, 'yyyy/m/d H:MM')}</a>]</span>
        ) : ''}
      </span>
    </div>
  )
}

const AttachedMedia = (props) => (
  <div>
    {props.mediaAttachments.map(att => (
      <span key={att.id}>
        <a href={att.url}>
          {att.type === 'image' || att.type === 'gifv'
            ? (<img src={att.preview_url} style={{ maxWidth: '100%', maxHeight: '110px' }} />)
            : att.type === 'video' ?
              (<video src={att.url} style={{ maxWidth: '100%', maxHeight: '110px' }} />)
              : ''
          }
        </a>
      </span>
    ))}
  </div>
)

const StatusBody = (props) => {
  const sts = props.status

  // 新規？ 熟練？
  const secAfterRegist = (new Date() - new Date(sts.account.created_at)) / 1000
  const shinki = secAfterRegist < 86400 *  7 // 新規さん
  const rougai = secAfterRegist > 86400 * 90 // 熟練ユーザー

  return (
    <div className={'md-grid md-grid--no-spacing' 
          + (shinki ? ' shinki' : '')
          + (rougai ? ' rougai' : '')
        }>
      {/* アイコン */}
      <span className='md-cell md-cell--1'>
        <a href={sts.account.url}>
          <img className='avatar'
            src={U.resolveAvatarUrl(props.host, sts.account.avatar)}
            role='presentation' />
        </a>
      </span>
      {/* 名前 */}
      <span className='md-cell md-cell--11 md-cell--7-tablet md-cell--3-phone'>
        <span className='md-text--secondary account_id'>
          [{sts.account.id}]
        </span> <span className='md-text--secondary account_registed'>
          [{U.toRelactiveString(sts.account.created_at)} 
          ({U.formatLocaleString(sts.account.created_at, 'yyyy/m/d H:MM')})]
        </span> <span className='md-text account_display_name'>
          {sts.account.display_name}
        </span> <span className='md-text--secondary account_acct'>
          @{sts.account.acct}
        </span>
        {sts.spoiler_text ? (
          <span className='md-text--secondary'>[CW: {sts.spoiler_text}]</span>
        ) : ''}
        <span className='md-text' dangerouslySetInnerHTML={{
          __html: sts.content
        }} />
        {sts.media_attachments.length > 0 ?
          <AttachedMedia mediaAttachments={sts.media_attachments} /> : ''}
      </span>
      <style jsx>{`
        .avatar { width: 48px; height: 48px; border-radius: 4px; }
        .account_id { display: none; }
        .shinki .avatar { border: solid 3px green; }
        .rougai .avatar { border: solid 3px orange; }
        .shinki .account_registed { background: #cfc; }
        .rougai .account_registed { background: #fec; }
      `}</style>
    </div>
  )
}

const StatusFooter = (props) => {
  const sts = props.status
  return (
    <div className='md-grid md-grid--no-spacing md-text--secondary'>
      <span className='md-cell md-cell--1 md-cell--tablet-hidden md-cell--phone-hidden'>
      </span>
      <span className='md-cell md-cell--1 md-text--secondary'>
        <IconSeparator label={sts.reblogs_count} iconBefore>
          <FontIcon forceFontSize forceSize={20}>cached</FontIcon>
        </IconSeparator>
      </span>
      <span className='md-cell md-cell--1 md-text--secondary'>
        <IconSeparator label={sts.favourites_count} iconBefore>
          <FontIcon forceFontSize forceSize={20}>star</FontIcon>
        </IconSeparator>
      </span>
      <span className='md-cell md-cell--9 md-cell--6-tablet md-cell--2-phone'>
        {sts.sensitive ? (<span>Sensitive | </span>) : ''}
        {sts.visibility}
        <span> | </span>
        {sts.application ? (<a href={sts.application.website}>{sts.application.name}</a>) : JSON.stringify(sts.application)}
      </span>
    </div>
  )
}

export default class Status extends React.Component {
  constructor(props) {
    super()
    this.state = {
      status: props.status,
    }
  }

  render() {
    const sts = this.state.status.reblog ? this.state.status.reblog : this.state.status

    return (
      <Paper zDepth={2} style={{
        margin: '0.3em 1em',
        padding: '0.1em 0.5em',
        borderRadius: '0.3em',
        backgroundColor: this.props.isMuteTarget ? 'red' : 'white',
      }}>
        <StatusHeader status={this.state.status} />
        <StatusBody host={this.props.host} status={sts} />
        <StatusFooter status={sts} />
      </Paper>
    )
  }
}
