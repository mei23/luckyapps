import UserIcon from '../components/UserIcon'

import * as U from '../utils/utils'

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
            <UserIcon account={user.obj} size='24' anim='-1' />
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
