'use babel'
import React from 'react'
import Thread from 'ssbmail-msg-thread'
import ClipboardBtn from 'react-clipboard.js'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import mlib from 'ssb-msgs'
import app from '../lib/app'

class Toolbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { wasCopied: false }
  }
  onCopy() {
    this.setState({ wasCopied: true })
  }
  render() {
    return <div className="toolbar">
      <div className="toolbar-inner">
        <a className="btn toolbar-btn" href="#" onClick={this.props.onBack}><i className="fa fa-angle-left" /> Inbox</a>
        <a className="btn toolbar-btn" href="#" onClick={this.props.onMarkUnread}>Mark Unread</a>
        <ClipboardBtn component="a" className="btn toolbar-btn" data-clipboard-text={this.props.msgId} onSuccess={this.onCopy.bind(this)}>{this.state.wasCopied?'Copied!':'Copy link'}</ClipboardBtn>
      </div>
    </div>
  }
}

export default class Msg extends React.Component {
  render() {
    const id = this.props.params && this.props.params.id
    const toolbarHandlers = {
      onBack: e => {
        e.preventDefault()
        app.history.pushState(null, '/')
      },
      onMarkUnread: e => {
        e.preventDefault()
        if (!this.refs.thread)
          return
        this.refs.thread.markUnread(err => {})
        app.history.pushState(null, '/')
      }
    }
    return <div id="msg">
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} composerProps={{ isPublic: true }} />
        <div className="flex-fill">
          <Toolbar {...toolbarHandlers} msgId={id} />
          <Thread id={id} ref="thread" live />
        </div>
      </div>
    </div>
  }
}