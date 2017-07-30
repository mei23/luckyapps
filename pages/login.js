import TextField from 'react-md/lib/TextFields'
import Button from 'react-md/lib/Buttons'
import FontIcon from 'react-md/lib/FontIcons'

import Layout from '../components/Layout'

export default (props) => (
  <Layout title='BirdKiller' disableLoggedInParts>
    <div>
      <h2>Mastodon ログイン</h2>
      ログイン先の Mastodon ホスト名を入力してください。
      <form action='/api/mastodon/login'>
        <div className='md-grid'>
          <TextField
            id='mastodon-login'
            name='host'
            label='例: mstdn.jp'
            type='text'
            leftIcon={<FontIcon>text_format</FontIcon>}
            size={20}
            className='md-cell md-cell--10'
            defaultValue='mstdn.jp'
          />
          <Button raised primary label="送信"
            className='md-cell md-cell--2 md-cell--middle'
            type='submit' />
        </div>
      </form>
    </div>
  </Layout>
)
