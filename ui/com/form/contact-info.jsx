import React from 'react'
import ClipboardBtn from 'react-clipboard.js'
import pu from 'patchkit-util'
import u from '../../lib/util'

export default class Prompt extends React.Component {
  static propTypes = {
    userId: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = { isCopied: false }
  }

  render() {
    const name = this.props.userId == app.user.id ? 'you' : pu.getName(app.users, this.props.userId)
    const namePossessive = this.props.userId == app.user.id ? 'Your' : (pu.getName(app.users, this.props.userId)+'\'s')
    const contactInfo = u.getUserContactInfo(this.props.userId)
    const hint = this.state.isCopied ? 'Copied!' : 'Copy to clipboard'
    return <div className="contact-info-form">
      <h1>{namePossessive} Contact Info</h1>
      <pre>{contactInfo}</pre>
      <div className="flex">
        <p className="flex-fill" style={{margin:0}}>Send this code to anybody you want to follow {name}.</p>
        <ClipboardBtn component="a" className="hint--left" data-clipboard-text={contactInfo} data-hint={hint} onSuccess={()=>this.setState({ isCopied: true })}>
          <i className="fa fa-clipboard" />
        </ClipboardBtn>
      </div>
    </div>
  }
}
