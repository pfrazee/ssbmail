'use babel'
import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import app from '../lib/app'
import SearchPalette from 'patchkit-search-palette'
import u from 'patchkit-util'
import { getResults } from '../lib/search'

export default class TopNav extends React.Component {
  constructor(props) {
    super(props)

    // listen for events that should update our state
    this._focusSearch = this.focusSearch.bind(this)
    app.on('focus:search', this._focusSearch)
  }
  componentWillUnmount() {
    app.removeListener('focus:search', this._focusSearch)
  }

  focusSearch() {
     this.refs.search.focus()
  }

  static IconLink(props) {
    const cls = classNames(props.className||'', 'ctrl flex-fill', props.hint ? ('hint--'+props.hint) : '')
    const count = typeof props.count !== 'undefined' ? <div className="count">{props.count}</div> : ''
    return <Link className={cls} to={props.to} data-hint={props.title}>
      <i className={'fa fa-'+props.icon} />
      <span className="label">{props.label}</span> {count}
    </Link>    
  }

  render() {
    const npubs = 0 // TODO

    return <div className="topnav">
      <div className="flex topnav-bar">
        <div className="logo"><Link to="/">[Mx]</Link></div>
        <div className="flex-fill">
          <div className="search">
            <SearchPalette ref="search" query={this.props.searchQuery} placeholder={this.props.placeholder} getResults={getResults} />
          </div>
        </div>
        <div className={`pubs ${npubs>0?'online':''}`}>
          <TopNav.IconLink to="/sync" icon="laptop" title={`You are ${npubs>0?'online':'offline'}`} hint="bottom" label={` ${npubs>0?npubs:'offline'}`} />
        </div>
        <div className="ctrls">
          <TopNav.IconLink to="/notices" icon="hand-peace-o" count={app.indexCounts.noticesUnread} title="Digs on your posts" hint="bottom" />
          <TopNav.IconLink to="/add-contact" icon="info-circle" title="Your contact info" hint="bottom" />
          <TopNav.IconLink to="/add-contact" icon="user-plus" title="Add contact" hint="bottom" />
        </div>
      </div>
    </div>
  }
}