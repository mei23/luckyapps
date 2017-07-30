import ListItem from 'react-md/lib/Lists/ListItem'
import Avatar from 'react-md/lib/Avatars'

import * as U from '../utils/utils'

export default (props) => (
    <ListItem
        leftAvatar={
            <Avatar role='presentation'
                src={U.resolveAvatarUrl(props.host, props.account.avatar)} />
        }
        primaryText={props.account.display_name}
        secondaryText={'@' + props.account.acct}
    />
)
