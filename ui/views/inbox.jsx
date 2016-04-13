'use babel'
import React from 'react'
import { Link } from 'react-router'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import RightNav from '../com/rightnav'
import MsgList from 'patchkit-msg-list'
import Thread from 'patchkit-flat-msg-thread'
import Oneline from 'mx-msg-view/oneline'
import DropdownBtn from 'patchkit-dropdown'
import app from '../lib/app'

export default class InboxPosts extends React.Component {
  getIndexName() {
    return ({
      inbox: 'inbox',
      mentions: 'mentions',
      private: 'privatePosts',
      watching: 'bookmarks'
    })[this.props.params.view||'inbox'] || 'inbox'
  }

  getIndexFn() {
    return ({
      inbox: app.ssb.patchwork.createInboxStream,
      mentions: app.ssb.patchwork.createMentionStream,
      private: app.ssb.patchwork.createPrivatePostStream,
      watching: app.ssb.patchwork.createBookmarkStream
    })[this.props.params.view||'inbox'] || app.ssb.patchwork.createInboxStream
  }

  getUnreadCount() {
    return ({
      inbox: app.indexCounts.inboxUnread,
      mentions: app.indexCounts.mentionUnread,
      private: app.indexCounts.privateUnread,
      watching: app.indexCounts.bookmarkUnread
    })[this.props.params.view||'inbox'] || 0
  }

  cursor (msg) {
    if (msg)
      return [msg.ts, false]
  }

  onMarkAllRead() {
    app.ssb.patchwork.markAllRead(this.getIndexName(), err => {
      if (err)
        app.issue('Failed to mark all read', err)
    })
  }

  render() {
    // setup params based on view, and whether we're looking at archived items
    const view = this.props.params.view || 'inbox'
    const source = this.getIndexFn()

    // components for rightnav and the end of the list
    /*const ThisRightNav = props => {
      const markAllReadItems = [{ label: 'Are you sure? Click here to confirm.', onSelect: this.onMarkAllRead.bind(this) }]
      return <RightNav />
       <DropdownBtn className="btn hint--top-left" hint="Mark all messages on this page as 'read'." items={markAllReadItems} right>
          <i className="fa fa-envelope" /> Mark all read
        </DropdownBtn>
      </RightNav>
    }*/

    // render
    return <div id="inbox" key={view}>
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} composerProps={{ isPublic: false }} />
        <MsgList
          ref="list"
          threads
          showMissing
          ListItem={Oneline} listItemProps={{ userPic: true }}
          Thread={Thread} threadProps={{ suggestOptions: app.suggestOptions, channels: app.channels }}
          live={{ gt: [Date.now(), null] }}
          emptyMsg={<div>Your inbox is empty.</div>}
          source={source}
          cursor={this.cursor} />
      </div>
    </div>
  }
}
