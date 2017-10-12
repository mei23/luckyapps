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
      <div className='user-list' style={{
        display: 'flex', flexWrap: 'wrap',
        'max-height': '100px',
        overflow: 'scroll',
        }}>
        {users.map(user => (
          <div className='user'>
            <UserIcon account={user.obj} text={user.cnt}
              size={32}
              anim='-1' />
          </div>
          
        ))}
      </div>
      <style jsx>{`
        .user {
          margin: 2px;
          animation-duration: 0.5s;
          animation-name: alived;
          animation-timing-function: ease-out;
        }

        @keyframes alived {
          0% {
            transform: scale(1.3);
            background: #ee9;
            box-shadow:0px 0px 6px 2px #ee9;
          }
          100% {
            background: none;
          }
        }
      `}</style>
    </div>)
}
