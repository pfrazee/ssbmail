import React from 'react'

export default class Alert extends React.Component {
  static propTypes = {
    Form: React.PropTypes.func.isRequired,
    formProps: React.PropTypes.object,
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func
  }

  onClose() {
    this.props.onClose && this.props.onClose()
  }

  render() {
    const okLabel = this.props.okLabel || 'OK'
    var Form = this.props.Form
    if (!this.props.isOpen || !Form)
      return <span/>

    return <div className={'modal modal-single modal-alert '+(this.props.className||'')}>
      <div className="modal-inner">
        <div className="modal-content">
          <Form ref="form" {...this.props.formProps} />
        </div>
        <div className="modal-ctrls">
          <div className="cancel">
            <button className="btn" onClick={this.onClose.bind(this)}>{okLabel}</button>
          </div>
        </div>
      </div>
    </div>
  }
}