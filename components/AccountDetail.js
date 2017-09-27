
import UserIcon from '../components/UserIcon'
import * as U from '../utils/utils'

export default (props) => (
  <div style={{ display: 'flex' }}>
    <div style={{ margin: '0.5em'}}>
      <UserIcon account={props.account} text='' size={48} anim='-1' />
    </div>
    <div style={{ margin: '0.5em'}}>
      <div>
        {props.account.display_name} (@{props.account.username}@{props.host})
      </div>
      <div>
       投稿={props.account.statuses_count}, 
       フォロワー={props.account.followers_count}, 
       フォロー={props.account.following_count}, 
     </div>
     <div>
       id={props.account.id}, 
       登録={U.formatLocaleString(props.account.created_at, 'yyyy/mm/dd HH:MM:ss.l')}
       ({U.toRelactiveString(props.account.created_at)})
     </div>
    </div>
  </div>
)
