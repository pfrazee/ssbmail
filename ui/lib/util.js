var ip = require('ip')
var social = require('patchkit-util/social')
var app = require('./app')

var getPeerData =
exports.getPeerData = function (id) {
  // try to find the ID in the peerlist, and see if it's a public peer if so
  for (var i=0; i < app.peers.length; i++) {
    var peer = app.peers[i]
    if (peer.key === id && !ip.isPrivate(peer.host))
      return peer
  }
  return false
}

exports.isPeer = function (id) {
  return !!getPeerData(id)
}

// has the peer has been successfully connecting or not?
// (not super precise but hey)
var isActivePeer =
exports.isActivePeer = function (peer) {
  if (typeof peer == 'string') // is an id
    peer = getPeerData(peer) // lookup
  return peer && peer.duration && peer.duration.count > peer.failure
}

var getUserPubs =
exports.getUserPubs = function (id) {
  return app.peers.filter(peer => !ip.isPrivate(peer.host) && social.follows(app.users, peer.key, id))
}

window.getUserContactInfo =
exports.getUserContactInfo = function (id) {
  id = id || app.user.id
  var pubs = getUserPubs(id).filter(isActivePeer)
  if (pubs.length > 0)
    return id + '[via]' + pubs[0].host + ':' + pubs[0].port + ':' + pubs[0].key
  return id
}

exports.getPubStats = function (peers) {
  var membersof=0, membersofActive=0, membersofUntried=0, connected=0
  ;(peers||app.peers||[]).forEach(function (peer) {
    // filter out LAN peers
    if (ip.isLoopback(peer.host) || ip.isPrivate(peer.host))
      return
    var connectSuccess = (peer.time && peer.time.connect && (peer.time.connect > peer.time.attempt) || peer.connected)
    if (connectSuccess)
      connected++
    if (social.follows(app.users, peer.key, app.user.id)) {
      membersof++
      if (connectSuccess)
        membersofActive++
      if (!peer.time || !peer.time.attempt)
        membersofUntried++
    }
  })

  return {
    membersof: membersof,
    membersofActive: membersofActive,
    membersofUntried: membersofUntried,
    connected: connected,
    hasSyncIssue: (!membersof || (!membersofUntried && !membersofActive))
  }
}

exports.getContactedPeerIds = function (peers) {
  let local = new Array()
  let remote = new Array()
  let connected = new Array()

  ;(peers||app.peers||[]).forEach(function (peer) {
    if (ip.isLoopback(peer.host)) return

    if (peer.connected) {
      connected.push(peer.id)
    }

    if (peer.connected || (peer.time && peer.time.connect)) {
      //TODO not sure about this
      if (ip.isPrivate(peer.host) || ip.isLoopback(peer.host)) { 
      //if (ip.isPrivate(peer.host)) { 
        local.push(peer.id)
      } else {
        remote.push(peer.id)
      }
    }
  })

  return {
    local: local,
    remote: remote,
    connected: connected
  }
}