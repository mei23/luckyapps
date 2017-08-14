
import * as U from '../utils/utils'

const AvatarIcon = (props) => {
  const acc = props.account
  const size = props.size > 0 ? props.size : 48
  const radius = Math.floor(size/12)
  
  return (
    <a href={acc.url} title={acc.display_name} target='_blank'>
      <img className='avatar'
        src={U.resolveAvatarUrl(props.host, acc.avatar)}
        style={{'width':`${size}px`, 'height':`${size}px`, 'border-radius':`${radius}px`}}
        role='presentation' />
    </a>
  )
}

export default (props) => {
  const users = props.users
  return (<div>
    <div>アクティブユーザー({users.length}人)</div>
    <div style={{ display:'flex', flexWrap: 'wrap' }}>
      {users.map(user => (
        <div style={{ margin:'2px' }}>
          <div style={{ padding:'0px', margin:'0px'}}><AvatarIcon account={user.obj} size='32' /></div>
          <div style={{'text-align':'right', marginTop:'-16px',
            textShadow: '0px 0px 2px #eee', color: '#000'
          }}>{user.cnt}</div>
        </div>
      ))}
    </div>

  </div>)
}
