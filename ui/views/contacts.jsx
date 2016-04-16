'use babel'
import React from 'react'
import VerticalFilledContainer from 'patchkit-vertical-filled'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import ContactList from 'mx-contact-list'
import Oneline from 'mx-contact-view/oneline'
import DropdownSelectorBtn from 'patchkit-dropdown-selector'
import u from 'patchkit-util'
import social from 'patchkit-util/social'
import app from '../lib/app'

const FILTER_OPTS = [
  { label: 'Followed', value: 'followed' },
  { label: 'Others', value: 'others' }
]

const filterFns = { 
  followed: id => social.follows(app.users, app.user.id, id),
  others: id => !social.follows(app.users, app.user.id, id) && id != app.user.id
}

class Toolbar extends React.Component {
  render() {
    return <div className="toolbar">
      <div className="toolbar-inner">
        <a className="btn toolbar-btn" href="#">Add New Contact</a>
        <a className="btn toolbar-btn" href={'#/profile/'+encodeURIComponent(app.user.id)}>Open Your Profile</a>
        <DropdownSelectorBtn className="btn toolbar-btn" items={FILTER_OPTS} initValue={this.props.currentFilter} label="Filter" onSelect={this.props.onSelectFilter} />
      </div>
    </div>
  }
}

export default class Contacts extends React.Component {
  constructor(props) {
    super(props)
    this.state = { filter: 'followed' }
  }
  onSelectFilter(filter) {
    this.setState({ filter: filter })
  }
  render() {
    const filter = filterFns[this.state.filter]
    const sortByName = (a, b) => u.getName(app.users, a).localeCompare(u.getName(app.users, b))

    return <div id="contacts">
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} />
        <div className="flex-fill">
          <Toolbar currentFilter={this.state.filter} onSelectFilter={this.onSelectFilter.bind(this)} />
          <VerticalFilledContainer id="contact-list-vertical">
            <ContactList ListItem={Oneline} filter={filter} sort={sortByName} />
          </VerticalFilledContainer>
        </div>
      </div>
    </div>
  }
}