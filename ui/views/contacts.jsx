'use babel'
import React from 'react'
import VerticalFilledContainer from 'patchkit-vertical-filled'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import ContactList from 'mx-contact-list'
import Oneline from 'mx-contact-view/oneline'
import u from 'patchkit-util'
import social from 'patchkit-util/social'
import app from '../lib/app'

class Toolbar extends React.Component {
  render() {
    return <div className="toolbar">
      <div className="toolbar-inner">
        <a className="btn toolbar-btn" href="#">Add New Contact</a>
        <a className="btn toolbar-btn" href="#">Get Your Contact Info</a>
      </div>
    </div>
  }
}

export default class Contacts extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const followedOnly = id => social.follows(app.users, app.user.id, id)
    const sortByName = (a, b) => u.getName(app.users, a).localeCompare(u.getName(app.users, b))

    return <div id="contacts">
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} />
        <div className="flex-fill">
          <Toolbar />
          <VerticalFilledContainer id="contact-list-vertical">
            <ContactList ListItem={Oneline} filter={followedOnly} sort={sortByName} />
          </VerticalFilledContainer>
        </div>
      </div>
    </div>
  }
}