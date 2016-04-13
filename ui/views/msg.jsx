'use babel'
import React from 'react'
import Thread from 'patchkit-flat-msg-thread'
import VerticalFilledContainer from 'patchkit-vertical-filled'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import mlib from 'ssb-msgs'
import app from '../lib/app'

export default class Msg extends React.Component {
  render() {
    const id = this.props.params && this.props.params.id
    return <div id="msg">
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} composerProps={{ isPublic: true }} />
        <VerticalFilledContainer id="msg-thread-vertical" style={{ width: '100%', borderTop: '1px solid #ddd' }}>
          <Thread id={id} suggestOptions={app.suggestOptions} channels={app.channels} forceRootExpanded live />
        </VerticalFilledContainer>
      </div>
    </div>
  }
}