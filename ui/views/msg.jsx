'use babel'
import React from 'react'
import Thread from 'mx-flat-msg-thread'
import VerticalFilledContainer from 'patchkit-vertical-filled'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import mlib from 'ssb-msgs'
import app from '../lib/app'

class Toolbar extends React.Component {
  render() {
    return <div className="toolbar">
      <div className="toolbar-inner">
        <a className="btn toolbar-btn" href="#" onClick={this.props.onBack}><i className="fa fa-angle-left" /> Inbox</a>
        <a className="btn toolbar-btn" href="#" onClick={this.props.onMarkUnread}>Mark Unread</a>
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
          <Toolbar {...toolbarHandlers} />
          <VerticalFilledContainer id="msg-thread-vertical">
            <Thread id={id} ref="thread" suggestOptions={app.suggestOptions} channels={app.channels} live />
          </VerticalFilledContainer>
        </div>
      </div>
    </div>
  }
}