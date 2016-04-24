'use babel'
import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import SearchPalette from 'patchkit-search-palette'
import ModalSingle from 'patchkit-modal/single'
import Alert from './alert'
import ContactInfoForm from './form/contact-info'
import AddContactForm from './form/add-contact'
import app from '../lib/app'
import u from '../lib/util'
import { getResults } from '../lib/search'

export default class TopNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      isContactInfoOpen: false,
      isAddContactOpen: false
    }

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

  onToggleContactInfo() {
    this.setState({ isContactInfoOpen: !this.state.isContactInfoOpen })
  }
  onToggleAddContact() {
    this.setState({ isAddContactOpen: !this.state.isAddContactOpen })
  }

  static IconLink(props) {
    const cls = classNames(props.className||'', 'ctrl flex-fill', props.hint ? ('hint--'+props.hint) : '')
    const count = typeof props.count !== 'undefined' ? <div className="count">{props.count}</div> : ''
    return <a className={cls} to={props.to} onClick={props.do} data-hint={props.title}>
      <i className={'fa fa-'+props.icon} />
      <span className="label">{props.label}</span> {count}
    </a>    
  }

  render() {
    const npubs = u.getUserPubs(app.user.id).filter(u.isActivePeer).length
    const pubsLabel = npubs === 0 ? ' offline' : <i className="fa fa-circle good-color" />

    return <div className="topnav">
      <div className="flex topnav-bar">
        <div className="logo"><Link to="/">SSB mail</Link></div>
        <div className="flex-fill">
          <div className="search">
            <SearchPalette ref="search" query={this.props.searchQuery} placeholder={this.props.placeholder} getResults={getResults} />
          </div>
        </div>
        <div className={`pubs ${npubs>0?'online':''}`}>
          <TopNav.IconLink to="#/sync" icon="laptop" title={`You are ${npubs>0?'online':'offline'}`} hint="bottom" label={pubsLabel} />
        </div>
        <div className="ctrls">
          {''/*TODO <TopNav.IconLink to="/notices" icon="hand-peace-o" count={app.indexCounts.noticesUnread} title="Digs on your posts" hint="bottom" />*/}
          <TopNav.IconLink do={this.onToggleContactInfo.bind(this)} icon="info-circle" title="Your contact info" hint="bottom" />
          <TopNav.IconLink do={this.onToggleAddContact.bind(this)} icon="user-plus" title="Add contact" hint="bottom" />
        </div>
      </div>
      <Alert className="center-block" Form={ContactInfoForm} formProps={{ userId: app.user.id }} isOpen={this.state.isContactInfoOpen} onClose={this.onToggleContactInfo.bind(this)} />
      <ModalSingle className="center-block" nextLabel="Lookup" Form={AddContactForm} isOpen={this.state.isAddContactOpen} onClose={this.onToggleAddContact.bind(this)} />
    </div>
  }
}