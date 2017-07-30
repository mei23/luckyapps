import Button from 'react-md/lib/Buttons/Button'
import Collapse from 'react-md/lib/Helpers/Collapse'

export default class Credits extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = { collapsed: true }
    this._toggleCollapse = this._toggleCollapse.bind(this)
  }

  _toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    return (
      <div>
        <Button raised label='クレジット情報' onClick={this._toggleCollapse} style={{ marginBottom: 16 }} />
        <Collapse collapsed={this.state.collapsed}>
          <ul>
            <li>開発: <a href='https://mstdn.jp/@the_boss'>@the_boss@mstdn.jp</a> (問題のご報告はこちらへ)</li>
            <li>ライブラリ提供: <a href='https://mstdn.jp/@tobikame'>@tobikame@mstdn.jp</a></li>
            <li>サウンド素材: <a href='http://taira-komori.jpn.org/'>無料効果音で遊ぼう！</a></li>
          </ul>
        </Collapse>
      </div>
    )
  }
}
