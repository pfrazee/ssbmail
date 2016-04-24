'use babel'
import React from 'react'
import MsgList from 'ssbmail-msg-list'
import Oneline from 'ssbmail-msg-view/oneline'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import app from '../lib/app'

export default class Data extends React.Component {
  render() {
    const source = opts => {
      return app.ssb.createLogStream(opts)
    }
    return <div id="data">
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} composerProps={{ isPublic: true }} />
        <MsgList
          forceRaw
          ListItem={Oneline}
          source={source}
          live={{ gt: Date.now() }} />
      </div>
    </div>
  }
}