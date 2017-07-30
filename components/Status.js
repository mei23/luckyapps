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
        <a href={props.status.url}>{U.toLocaleString(props.status.created_at)}</a>
        {reblog ? (
          <span> [Original:&nbsp;<a href={reblog.url}>{U.toLocaleString(reblog.created_at)}</a>]</span>
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
            ? (<img src={att.url} style={{ maxWidth: '100%', height: 'auto' }} />)
            : att.type === 'video' ?
              (<video src={att.url} />)
              : ''
          }
        </a>
      </span>
    ))}
  </div>
)

const StatusBody = (props) => {
  const sts = props.status
  return (
    <div className='md-grid md-grid--no-spacing'>
      <span className='md-cell md-cell--1'>
        <img className='avatar' src={U.resolveAvatarUrl(props.host, sts.account.avatar)}
          role='presentation' />
      </span>
      <span className='md-cell md-cell--11 md-cell--7-tablet md-cell--3-phone'>
        <span className='md-text'>
          {sts.account.display_name}
        </span>
        <span> </span>
        <span className='md-text--secondary'>
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
          .avatar { width: 48px; height: 48px; }
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
        marginBottom: '20px',
        backgroundColor: this.props.isMuteTarget ? 'red' : 'white',
      }}>
        <StatusHeader status={this.state.status} />
        <StatusBody host={this.props.host} status={sts} />
        <StatusFooter status={sts} />
      </Paper>
    )
  }
}
