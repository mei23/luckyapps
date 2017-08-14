import FontIcon from 'react-md/lib/FontIcons'
import Paper from 'react-md/lib/Papers'
import IconSeparator from 'react-md/lib/Helpers/IconSeparator'

import * as U from '../utils/utils'

const StatusHeaderEx = (props) => {
  const reblog = props.status.reblog ? props.status.reblog : null
  return (
    <div style={{ 
      'display':'flex', 
      'justify-content': 'flex-end',
      'text-align':'right'}}>
      <div className='md-text--secondary'
      style={{'margin-right':'auto'}}
      >
        {props.status.id}
        {reblog ? (
          <span> [Boosted:&nbsp;{reblog.id}]</span>
        ) : ''}
      </div>
      <div className='md-text--secondary'
        style={{ textAlign: 'right',  }}>
        <a href={props.status.url}>{U.toLocaleString(props.status.created_at)}</a>
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

// account object
// https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#account

const AvatarBox = (props) => {
  const sts = props.status
  const size = props.size > 0 ? props.size : 48
  const radius = Math.floor(size/12)
  const showSts = props.showSts
  
  return (
    <div className='avatar-box' style={{'width':`${size}px`}}>
      <div>
        <a href={sts.account.url} title={sts.account.display_name} target='_blank'>
          <img className='avatar'
            src={U.resolveAvatarUrl(props.host, sts.account.avatar)}
            style={{'width':`${size}px`, 'height':`${size}px`, 'border-radius':`${radius}px`}}
            role='presentation' />
        </a>
      </div>
      { showSts ? 
        <div style={{'text-align':'right', 
        'padding':'0px', 'margin':'0px',
        }}>
          {sts.account.statuses_count}
        </div>: '' } 
    </div>
  )
}

const StatusBodyEx = (props) => {
  const sts = props.status
  return (
    <div className=''>
      <span className=''>
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
          <AttachedMediaEx mediaAttachments={sts.media_attachments} /> : ''}
      </span>
    </div>
  )
}

const StatusFooterEx = (props) => {
  const sts = props.status
  return (
    <div>
      <span className='md-text--secondary' style={{margin:'0em 1em'}}>
        🔃 {sts.reblogs_count}
      </span>
      <span className='md-text--secondary' style={{margin:'0em 1em'}}>
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

    return (
      <Paper zDepth={2} style={{
        margin: '0.2em 0.4em',
        borderRadius: '0.2em',
        backgroundColor: this.props.isMuteTarget ? 'red' : 'white',
      }}>
        <div style={{ display: 'flex' }}>
          <div style={{ margin:'0.3em'}}>
            <AvatarBox status={sts} size='48' showSts='1' />
          </div>
          <div style={{ margin:'0.3em', 'width':'100%'}}>
            <StatusHeaderEx status={this.state.status} />
            <StatusBodyEx host={this.props.host} status={sts}/>
            <StatusFooterEx status={sts} />
          </div>
        </div>
      </Paper>
    )
  }
}
