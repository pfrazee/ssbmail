'use babel'
import React from 'react'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import { ChatsList, ChatView } from 'ssbmail-chat'
import u from 'patchkit-util'
import social from 'patchkit-util/social'
import app from '../lib/app'

class Toolbar extends React.Component {
  render() {
    return <div className="toolbar">
      <div className="toolbar-inner">
        <a className="btn toolbar-btn" href={"#/profile/"+encodeURIComponent(this.props.userId)}>Go to Profile</a>
      </div>
    </div>
  }
}

export default class Chat extends React.Component {
  render() {
    // setup params based on view, and whether we're looking at archived items
    var id = this.props.location.query.id
    if (id)
      id = decodeURIComponent(id)
    const sortByName = (a, b) => u.getName(app.users, a).localeCompare(u.getName(app.users, b))
    const users = social.followeds(app.users, app.user.id).sort(sortByName)

    // render
    return <div id="chat">
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location}/>
        <div className="flex-fill">
          <Toolbar userId={id} />
          <ChatView id={id} />
        </div>
      </div>
    </div>
  }
}
