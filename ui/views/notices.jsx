'use babel'
import React from 'react'
import { Link } from 'react-router'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import MsgList from 'patchkit-msg-list'
import Thread from 'patchkit-flat-msg-thread'
import Card from 'mx-msg-view/card'
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
          ListItem={Notification} listItemProps={{ userPic: true }}
          Thread={Thread} threadProps={{ suggestOptions: app.suggestOptions, channels: app.channels }}
          live={{ gt: [Date.now(), null] }}
          emptyMsg="Nobody has dug any of your posts yet. They will, though!"
          source={app.ssb.patchwork.createNoticeStream}
          cursor={this.cursor} />
      </div>
    </div>
  }
}
