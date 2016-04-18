import React from 'react'
import app from '../../lib/app'

export default class AddContactForm extends React.Component {
  static propTypes = {
    setIsValid: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = { contactInfo: '' }
    this.props.setHelpText(false)
  }

  onChange(e) {
    this.setState({ contactInfo: e.target.value })
    this.props.setIsValid(!!e.target.value)
  }

  submit(cb) {
    pull(
      app.ssb.patchwork.useLookupCode(this.state.contactInfo),
      pull.drain(e => {
        switch (e.type) {
          case 'error':
            this.props.setHelpText(<span className="bad-color">Error: {e.message}</span>)
            break
          case 'failure':
            this.props.setHelpText(<span className="bad-color">We{"'"}re sorry! The contact could not be found. Please make sure that you are online, and that the contact info is correct.</span>)
            break
          case 'connecting':
            this.props.setHelpText('Contacting '+e.addr.host+'...')
            break
          case 'syncing':
            this.props.setHelpText('Asking '+e.addr.host+'...')
            break
          case 'success':
            app.history.pushState(null, '/profile/'+encodeURIComponent(e.id))
            cb()
            break
        }
      })
    )
  }

  render() {
    return <div className="add-contact-form">
      <h1>Add Contact</h1>
      <form className="block" onSubmit={e=>e.preventDefault()}>
        <input type="text" value={this.state.contactInfo} onChange={this.onChange.bind(this)} placeholder="Contact info" />
        <p>Copy the Contact Info into the field above.</p>
      </form>
    </div>
  }
}
