'use babel'
import React from 'react'
import MsgList from 'mx-msg-list'
import Event from 'mx-msg-view/event'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import app from '../lib/app'

export default class Feed extends React.Component {
  render() {
    const source = opts => {
      return app.ssb.patchwork.createCertStream(opts)
    }
    const cursor = msg => {
      if (msg)
        return [msg.ts, false]
    }
    return <div id="feed">
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} />
        <div className="flex-fill">
          <MsgList
            ListItem={Event}
            source={source}
            cursor={cursor}
            live={{ gt: [Date.now(), null] }} />
        </div>
      </div>
    </div>
  }
}