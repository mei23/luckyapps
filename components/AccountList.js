
import * as U from '../utils/utils'

/**
 * User icon with link
 */
const AvatarIcon = (props) => {
  const acc = props.account
  const size = props.size > 0 ? props.size : 48
  const radius = Math.floor(size/12)
  
  return (
    <a href={acc.url} title={acc.display_name} target='_blank'>
      <img className='avatar'
        src={U.resolveAvatarUrl(props.host, acc.avatar)}
        style={{ width:`${size}px`, height:`${size}px`, borderRadius:`${radius}px` }}
        role='presentation' />
    </a>
  )
}

/**
 * Active users part
 */
export default (props) => {
  const users = props.users
  return (
    <div className='active-users'>
      <div>アクティブユーザー({users.length}人)</div>
      <div className='user-list' style={{ display: 'flex', flexWrap: 'wrap' }}>
        {users.map(user => (
          <div className='user'>
            <div className='user-icon'>
              <AvatarIcon account={user.obj} size='24' />
            </div>
            <div className='user-toot'>{user.cnt}</div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .user { margin: 2px; }
        .user-icon { margin: 0px; padding: 0px; }
        .user-toot {
          text-align: right;
          margin-top: -16px;
          color: #000;
          textShadow: 0px 0px 2px #eee;
        }
      `}</style>
    </div>)
}
