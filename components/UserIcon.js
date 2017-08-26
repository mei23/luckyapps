import * as U from '../utils/utils'

// host: mstdn host
// account: Account object

// size: in px (optional, default:48)

// anim: アニメーションする？ (optional, default:0)
// -1:never(絶対にしない), 0:onHover(Hoverのみ), 1:allways(常にする)

export default class UserIcon extends React.Component {
  constructor(props) {
    super(props)

    this.mouseOver = this.mouseOver.bind(this)
    this.mouseOut = this.mouseOut.bind(this)

    this.state = {
      hover: false
    }
  }
  mouseOver = () => {
    this.setState({hover: true})
  }
  mouseOut() {
    this.setState({hover: false})
  }

  render() {
    const acc = this.props.account
    const host = this.props.host
    const size = this.props.size > 0 ? this.props.size : 48
    const radius = Math.floor(size/12)

    const anim = this.props.anim || 0

    const urlStatic  = U.resolveAvatarUrl(host, acc.avatar_static)
    const urlDynamic = U.resolveAvatarUrl(host, acc.avatar)
    const urlOut   = 1 <= anim ? urlDynamic : urlStatic
    const urlHover = 0 <= anim ? urlDynamic : urlStatic

    return (
      <div
        onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}
        style={{
          'width': `${size}px`, 'height': `${size}px`, 
          'border-radius': `${radius}px`,
          'background-image': (this.state.hover
            ? 'url(' + urlHover + ')'
            : 'url(' + urlOut + ')'),
          'background-size': `${size}px`,
      }}
      >
      </div>
    )
  }
}

