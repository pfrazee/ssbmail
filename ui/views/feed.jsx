'use babel'
import React from 'react'
import MsgList from 'mx-msg-list'
import Event from 'mx-msg-view/event'
import DropdownBtn from 'patchkit-dropdown'
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
    var currentFilter = this.props.currentFilter
    
    const o = (label, value) => {
      return { 
        label: <span><i className={'fa fa-'+(currentFilter==value?'check-circle-o':'circle-thin')}/> {label}</span>,
        value: value
      }
    }
    const FILTER_OPTS = [
      o('All', 'all'),
      o('You', 'you')
    ]

    return <div className="toolbar">
      <div className="toolbar-inner">
        <DropdownBtn className="btn toolbar-btn" items={FILTER_OPTS} onSelect={this.props.onSelectFilter}>
          Filter: {currentFilter} <i className="fa fa-angle-down" />
        </DropdownBtn>
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
    console.log('select', filter)
    this.setState({ filter: filter })
  }
  render() {
    console.log('filter', this.state.filter, filterFns[this.state.filter])
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