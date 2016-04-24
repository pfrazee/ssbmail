'use babel'
import React from 'react'
import { Link } from 'react-router'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import MsgList from 'ssbmail-msg-list'
import Card from 'ssbmail-msg-view/card'
import app from '../lib/app'

export default class Notices extends React.Component {
  cursor (msg) {
    if (msg)
      return [msg.ts, false]
  }
  render() {
    return <div id="notices">
      <TopNav composer composerProps={{ isPublic: true }} />
      <div className="flex">
        <LeftNav location={this.props.location} />
        <MsgList
          ref="list"
          threads
          dateDividers
          ListItem={Card}
          live={{ gt: [Date.now(), null] }}
          emptyMsg="Nobody has dug any of your posts yet. They will, though!"
          source={app.ssb.patchwork.createNoticeStream}
          cursor={this.cursor} />
      </div>
    </div>
  }
}
