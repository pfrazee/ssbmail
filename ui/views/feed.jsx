'use babel'
import React from 'react'
import MsgList from 'ssbmail-msg-list'
import Event from 'ssbmail-msg-view/event'
import DropdownSelectorBtn from 'patchkit-dropdown-selector'
import mlib from 'ssb-msgs'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import app from '../lib/app'

const source = opts => {
  return app.ssb.patchwork.createCertStream(opts)
}

const cursor = msg => {
  if (msg)
    return [msg.ts, false]
}

const FILTER_OPTS = [
  { label: 'All', value: 'all' },
  { label: 'You', value: 'you' }
]

const filterFns = { 
  all: msg => true,
  you: msg => {
    if (msg.value.author == app.user.id)
      return true
    const contact = mlib.link(msg.value.content.contact)
    if (contact && contact.link == app.user.id)
      return true
  }
}

class Toolbar extends React.Component {
  render() {
    return <div className="toolbar">
      <div className="toolbar-inner">
        <DropdownSelectorBtn className="btn toolbar-btn" items={FILTER_OPTS} initValue={this.props.currentFilter} label="Filter" onSelect={this.props.onSelectFilter} />
      </div>
    </div>
  }
}

export default class Feed extends React.Component {
  constructor(props) {
    super(props)
    this.state = { filter: 'all' }
  }
  onSelectFilter(filter) {
    this.setState({ filter: filter })
  }
  render() {
    return <div id="feed" key={this.state.filter}>
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} />
        <div className="flex-fill">
          <Toolbar currentFilter={this.state.filter} onSelectFilter={this.onSelectFilter.bind(this)} />
          <MsgList
            ListItem={Event}
            source={source}
            cursor={cursor}
            filter={filterFns[this.state.filter]}
            live={{ gt: [Date.now(), null] }} />
        </div>
      </div>
    </div>
  }
}