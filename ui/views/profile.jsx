
import React from 'react'
import VerticalFilledContainer from 'patchkit-vertical-filled'
import { UserPic, UserLinks } from 'patchkit-links'
import mlib from 'ssb-msgs'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import DropdownSelectorBtn from 'patchkit-dropdown-selector'
import MsgList from 'mx-msg-list'
import MsgOneline from 'mx-msg-view/oneline'
import ContactList from 'mx-contact-list'
import ContactOneline from 'mx-contact-view/oneline'
import { SyncStatus } from 'mx-contact-view/oneline'
import u from 'patchkit-util'
import social from 'patchkit-util/social'
import app from '../lib/app'

const VIEW_OPTS = [
  { label: 'Messages', value: 'messages' },
  { label: 'Contacts', value: 'contacts' },
  { label: 'Verifications', value: 'verifications' },
]

class Toolbar extends React.Component {
  render() {
    return <div className="toolbar">
      <div className="toolbar-inner">
        <a className="btn toolbar-btn" href="#/contacts"><i className="fa fa-angle-left"/> Contacts</a>
        <DropdownSelectorBtn className="btn toolbar-btn" items={VIEW_OPTS} initValue={this.props.currentView} label="View" onSelect={this.props.onSelectView} />
        <div className="toolbar-divider"/>
        <a className="btn toolbar-btn" href="#">Get Contact Info</a>
        <a className="btn toolbar-btn" href="#">Verify</a>
      </div>
    </div>
  }
}

const cursor = msg => {
  if (msg)
    return [msg.ts, false]
}

function findLink (links, id) {
  for (var i=0; i < (links ? links.length : 0); i++) {
    if (links[i].link === id)
      return links[i]
  }
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = { view: 'messages' }
  }

  onSelectView(view) {
    this.setState({ view: view })
  }

  render() {
    const id = this.props.params && this.props.params.id
    const name = u.getName(app.users, id)

    const msgFilter = msg => !!findLink(mlib.links(msg.value.content.recps), id)
    const contactFilter = id2 => social.follows(app.users, id, id2)
    const sortByName = (a, b) => u.getName(app.users, a).localeCompare(u.getName(app.users, b))

    var view
    if (this.state.view == 'messages') {
      view = <MsgList
        threads
        ListItem={MsgOneline}
        live={{ gt: [Date.now(), null] }}
        emptyMsg={<div>No messages from {name}.</div>}
        source={app.ssb.patchwork.createInboxStream}
        filter={msgFilter}
        cursor={cursor} />
    } else if (this.state.view == 'contacts') {
      view = <VerticalFilledContainer>
        <ContactList ListItem={ContactOneline} filter={contactFilter} sort={sortByName} />
      </VerticalFilledContainer>
    } else {
      view = <VerticalFilledContainer>
        todo
      </VerticalFilledContainer>
    }

    return <div id="profile" key={'profile:'+id}>
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} />
        <div className="flex-fill">
          <Toolbar currentView={this.state.view} onSelectView={this.onSelectView.bind(this)} />
          <div className="profile-header">
            <UserPic id={id} />
            <div className="info">
              <h1>{name} <SyncStatus users={app.users} a={id} b={app.user.id} /></h1>
              <div className="btns">
                <a className="btn highlighted" href="#">Following <i className="fa fa-angle-down" /></a>
                <a className="btn highlighted" href="#">New Message</a>
              </div>
              <div>Followed by: <UserLinks limit={2} ids={social.followedFollowers(app.users, app.user.id, id)} /></div>
              <div>Verified by: none.</div>
            </div>
          </div>
          {view}
        </div>
      </div>
    </div>
  }
}
