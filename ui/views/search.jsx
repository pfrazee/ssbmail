'use babel'
import React from 'react'
import TopNav from '../com/topnav'
import LeftNav from '../com/leftnav'
import MsgList from 'ssbmail-msg-list'
import Card from 'ssbmail-msg-view/card'
import app from '../lib/app'

export default class Search extends React.Component {

  render() {
    const source = opts => {
      opts.query = this.props.params.query
      return app.ssb.patchwork.createSearchStream(opts)
    }
    const cursor = msg => {
      if (msg)
        return msg.ts
    }
    return <div id="search" key={this.props.params.query}>
      <TopNav />
      <div className="flex">
        <LeftNav location={this.props.location} composerProps={{ isPublic: true }} />
        <MsgList
          ref="list"
          threads
          dateDividers
          batchLoadAmt={5}
          ListItem={Card} listItemProps={{ listView: true }}
          emptyMsg="No results found."
          source={source}
          cursor={cursor} />
      </div>
    </div>
  }
}