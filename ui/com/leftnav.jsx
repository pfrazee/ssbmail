'use babel'
import React from 'react'
import { Link } from 'react-router'
import LocalStoragePersistedComponent from 'patchkit-ls-persisted'
import Composer from 'mx-composer'
import Issues from './issues'
import app from '../lib/app'
import u from 'patchkit-util'

class LinkGroup extends LocalStoragePersistedComponent {
  constructor(props) {
    super(props, 'linkgroup-'+props.group, {
      isExpanded: true
    })
  }
  render() {
    const b = this.state.isExpanded
    const toggle = e => { e.preventDefault(); e.stopPropagation(); this.setState({ isExpanded: !b }) }
    return <div>
      <LeftNav.Link pathname={this.props.pathname} to={this.props.to} expander expanded={b} onToggleExpand={toggle}>
        {this.props.icon ? <i className={'fa fa-'+this.props.icon} /> : ''}
        {this.props.label}
      </LeftNav.Link>
      { b ? <div className="sublinks">{ this.props.children }</div> : '' }
    </div>
  }
}

export default class LeftNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      indexCounts: app.indexCounts,
      isComposerOpen: false
    }

    // watch for updates to global state
    this.refresh = () => {
      this.setState({ indexCounts: app.indexCounts })
    }
    app.on('update:indexCounts', this.refresh)
  }
  componentWillUnmount() {
    app.removeListener('update:indexCounts', this.refresh)
  }

  onClickCompose() {
    clearTimeout(this.expandTimeout)
    if (this.state.isComposerOpen) {
      this.setState({ isComposerOpen: false })
    } else {
      this.setState({ isComposerOpen: true }, () => {
        if (!this.refs.composer)
          return

        // focus the textarea
        const cp = this.props.composerProps
        if (cp && (cp.recps || cp.isPublic)) // if public, or recps are provided, focus straight onto the textarea
          this.refs.composer.querySelector('textarea').focus()
        else
          this.refs.composer.querySelector('input[type=text], textarea').focus()

        // after the expand animation, remove the max-height limit so that the preview can expand
        this.expandTimeout =
          setTimeout(() => this.refs.composer.style.maxHeight = '100%', 1e3)
      })
    }
  }

  onSend(msg) {
    this.setState({ isComposerOpen: false })
    if (this.props.onSend)
      this.props.onSend(msg)
  }

  static Heading (props) {
    return <div className="heading">{props.children}</div>
  }
  static Link (props) {
    return <div className={'link '+(props.className||'')+(props.pathname === props.to ? ' selected' : '')}>
      { props.expander ? <i className={`expander fa fa-caret-${(props.expanded?'down':'right')}`} onClick={props.onToggleExpand} /> : '' }
      <Link to={props.to}>{props.children}</Link>
    </div>
  }

  render() {
    const onClickCompose = this.onClickCompose.bind(this)
    const pathname = this.props.location && this.props.location.pathname

    // render
    return <div className="leftnav">
      { this.state.isComposerOpen
        ? <a className="btn highlighted big-btn" onClick={onClickCompose}><i className="fa fa-times" /> Cancel</a>
        : <a className="btn highlighted big-btn" onClick={onClickCompose}><i className="fa fa-pencil" /> Compose</a> }

      { this.state.isComposerOpen
        ? <div ref="composer" className="leftnav-composer">
            <Composer {...this.props.composerProps} suggestOptions={app.suggestOptions} channels={app.channels} onSend={this.onSend.bind(this)} />
          </div>
        : '' }

      <Issues/>
      
      <LeftNav.Link pathname={pathname} to="/"><i className="fa fa-inbox"/><strong>Inbox ({app.indexCounts.inboxUnread})</strong></LeftNav.Link>
      <LeftNav.Link pathname={pathname} to="/contacts"><i className="fa fa-user"/>Contacts</LeftNav.Link>
      <LeftNav.Link pathname={pathname} to="/feed"><i className="fa fa-share-alt"/>Certs</LeftNav.Link>

      <hr/>
      <LeftNav.Link className="thin" pathname={pathname} to={`/profile/${encodeURIComponent(app.user.id)}`}>Your Profile</LeftNav.Link>
      <LeftNav.Link className="thin" pathname={pathname} to="/sync">Network Sync</LeftNav.Link>
      <LeftNav.Link className="thin" pathname={pathname} to="/data">Data Feed</LeftNav.Link>
      
    </div>
  }
}