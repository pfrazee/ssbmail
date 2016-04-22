'use babel'
import React from 'react'
import { Link } from 'react-router'
import LocalStoragePersistedComponent from 'patchkit-ls-persisted'
import Composer from 'mx-composer'
import { ChatsList } from 'mx-chat'
import Issues from './issues'
import app from '../lib/app'
import u from 'patchkit-util'
import social from 'patchkit-util/social'

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

  onToggleCompose() {
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
    const onToggleCompose = this.onToggleCompose.bind(this)
    const pathname = this.props.location && this.props.location.pathname

    const sortByName = (a, b) => u.getName(app.users, a).localeCompare(u.getName(app.users, b))
    const users = social.followeds(app.users, app.user.id).sort(sortByName)

    // handle chat specially (for now)
    // TODO
    // re-enable chat view when its implemented
    // for now, just go to their profile page
    // -prf
    var chatId = false
    // if (pathname == '/chat')
    //   chatId = decodeURIComponent(this.props.location.query.id)
    // const onSelectChat = id => app.history.pushState(null, '/chat?id='+encodeURIComponent(id))
    if (pathname.indexOf('/profile') === 0)
      chatId = decodeURIComponent(pathname.slice('/pathname'.length))
    const onSelectChat = id => app.history.pushState(null, '/profile/'+encodeURIComponent(id))

    // render
    return <div className="leftnav">
      <a className="btn highlighted big-btn" onClick={onToggleCompose}><i className="fa fa-pencil" /> Compose</a>

      { this.state.isComposerOpen
        ? <div ref="composer" className="leftnav-composer">
            <Composer suggestOptions={app.suggestOptions} onSend={this.onSend.bind(this)} onCancel={onToggleCompose} />
          </div>
        : '' }

      <Issues/>
      
      <LeftNav.Link pathname={pathname} to="/"><i className="fa fa-inbox"/><strong>Inbox ({app.indexCounts.inboxUnread})</strong></LeftNav.Link>
      <LeftNav.Link pathname={pathname} to="/contacts"><i className="fa fa-user"/>Contacts</LeftNav.Link>
      <LeftNav.Link pathname={pathname} to="/feed"><i className="fa fa-share-alt"/>Certs</LeftNav.Link>
      <hr/>
      <ChatsList selected={chatId} ids={users} onSelect={onSelectChat} />
      
    </div>
  }
}