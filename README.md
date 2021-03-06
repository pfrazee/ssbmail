# ssb mail

SSBMail is an encrypted mail network. [Status: experimental](#status-experimental)

![screenshot.png](screenshot.png)

## Secure mail, dumb hosts

SSBMail is end-to-end encrypted mail.
Your private messages are unreadable, except to the recipients.

SSBMail's user-authentication does not depend on a third party.
You collect proofs of identity from a social web-of-trust, and those proofs are stored on your device.

SSBMail's internal message format is typed JSON.
You can use [the API](https://scuttlebot.io/docs/basics/open-a-client.html) to write applications other than mail.

SSBMail's servers, called Pubs, are not hosts, and dont see your private messages.
They handle very basic tasks, like log- and file-replication.

**Protocol reference**
 - [Secure Scuttlebutt](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html) p2p signed-log gossip
 - [Secret Handshake](https://scuttlebot.io/more/protocols/secret-handshake.html) transport layer security
 - [Private Box](https://scuttlebot.io/more/protocols/private-box.html) log-entry encryption
 - [Scuttlebot API](https://scuttlebot.io/) the embedded database/networking stack


### Overview

#### Signed logs

SSBMail is built on the [secure scuttlebutt signed-log network](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html).
It is a decentralized network.

Rather than attempting to route individual messages to specific hosts, SSBMail writes the user's messages to an append-only log.
Each user has its own log, identified by the public key.
The log is then gossiped uniformly to any peer that's interested in the messages.

#### Encrypted mail

Private messages are encrypted onto the log with the [private box protocol](https://scuttlebot.io/more/protocols/private-box.html).
Private-box hides the data and metadata of the message; it doesn't reveal the content, subject line, or recipients.

When each log-entry is downloaded, the log's followers attempt to decrypt it with their private key.
If successful, then the the follower knows the message was for them; otherwise, the message is ignored (and can be discarded).

#### Recipient authentication

SSBMail uses a [web of trust](https://en.wikipedia.org/wiki/Web_of_trust) to authenticate users.
Users follow each other's SSB logs to form a "cryptographic social network."
The follows are broadcasted publicly on user logs, for everyone to see.
Confidence in identities is created by aggregating positive signals (follows, "verifications") and negative signals (flags) from the user's social graph.

#### Explicit following

SSBMail only allows users that you follow to message you.
This stops spam from reaching your inbox.

#### "Pub" dumb servers

SSBMail runs on the user device, not on a web host.
This is to protect the encryption keys.
It also lets us have offline operation, and better performance in some cases.

The SSB protocol is peer-to-peer, but there is no global DHT or NAT-traversal system.
It's therefore not possible to connect users' devices directly, unless they're on a LAN.
Instead, we use the Pub servers to rehost the users' logs.

Pub servers are unprivileged and not given any trust.
They periodically fetch updates to their members' logs, and hold them indefinitely, for other users to download.
They can not read your mail, because the mail is encrypted with private-box.
They improve the network's uptime, and they keep users from having to reveal their IPs to each other.

You must register with a Pub to be active on the network.
If you know how to run nodejs on linux, then it's easy to setup one yourself; [here is the howto guide](https://scuttlebot.io/docs/config/create-a-pub.html).
Unlike email, you can change your pub without losing your identity, or use more than one.

#### Introduction / user-discovery

The SSBMail protocols (SSB) lack a centralized name registry.
Therefore users have to exchange contact info out-of-band.
SSBMail gives a UI control for doing so.

The contact info includes 4 pieces of information, formatted as follows:

```
{user-pubkey}:via:{pubserver-hostname}:{pubserver-port}:{pubserver-pubkey}
```

It tends to be ~130 characters long.


#### Automated bot users

Bots are easy to write for SSBMail.
You can use them to create mailing lists, user-directories, and so on.
(Pubs are a kind of bot.)
Documentation is available on the [Scuttlebot site](https://scuttlebot.io/) (Scuttlebot is the engine behind SSBMail).


---


Some todo ideas for the future.


#### Verifications

It'd be useful if we could bind users' SSBMail identities to other non-ssb accounts, by sharing proofs of key-ownership through them.
This would improve the confidence in user identities.

For instance, you might assert, "I am bob@gmail.com," by publishing the claim on your log.
You'd send that log entry's JSON (which includes your signature) to Alice via bob@gmail.com.
Alice would input this proof into SSBMail; Alice would confirm she received it from bob@gmail.com, and SSBMail would confirm the message matches your log.

Afterward, SSBMail would publish a verification-message on Alice's log, saying that she confirmed your identity.
Alice's followers would add that verification to their evaluation of your account.

#### User directories

We can use directory-sites, backed by logs, to improve discovery.

The site could run a service for proving ownership of other accounts (twitter, email, github, etc).
The verifications would be broadcast on an ssb log.
Users could choose to follow the directory log, in order to monitor and auto-download contact data.
Alternatively, they could go directly to the directory-site to lookup people.

A directory site could aggregate the entries from multiple directory logs.

To keep a directory's log from becoming too large to follow, it might be a good idea to run directories as small communities, or groups.
They might be part of a mailing-list, for instance.
The goal would not to be to create "one directory log to rule them all."
The goal is to serve communities which have the social connectedness to verify and monitor each other.

#### Tighter pub relationships

Currently, SSBMail will sync with any pub that a followed user has announced.
This is a bit too chatty.

I'd prefer that SSBMail only connected to my pub(s), while the pub servers stayed just as chatty with each other.
That way, I don't have to reveal my presence to pubs that I don't have a relationship with.

#### Sidelogs and access-control

The SSB network distributes the logs to any peer that requests them; there's no access-control.
The logic is, private entries are protected by encryption, not access-control.

This makes me a little uncomfortable.
Imagine your private key was posted on pastebin.
Since your messages can be retrieved freely, the entire world could now see your PMs, without expending a whole lot of effort to get them.

A private key compromise is always going to be disasterous.
But, we can still take steps to contain the damage.

We might consider creating "sidelogs" for each contact.
This would be, a new keypair, and new ssb log, that's created when you add somebody to your contacts.
This log would contain all private messages directed to the contact.
The log would only be allowed to replicate to your device, the contact's device, your pub(s), and the contact's pub(s).

This would add some protocol overhead.

#### "Friend request" protocol

It would be handy if you could send a message to a user's pub, asking for an introduction to a user.
The pub would mail the target user with your contact info.

#### Multi-key identities

SSB logs have a rigid correctness constraint, that you must maintain a linear sequence (seq: 1, seq: 2, seq: 3, etc).
This means you cant share a log between multiple devices, unless you have a highly-consistent ordering process, perhaps by a server/client system.

Since it's likely we'll need to alias multiple identities anyway, it may be best to implement multi-device support by giving each their own keypair & log, and then aliasing them together.

#### Chat

Mail and chat are like PB&J.
They belong together!

This is really just an interface todo.
(In fact, the code is 60% written for one-to-one chat.)

---

### Status: experimental

SSBMail is still under development.
Here are some important reasons to use caution:

 - SSBMail hasn't been audited.
 - SSBMail depends on a lot of NPM packages, which are fetched on install; we have to trust NPM and the package-owners not to do Bad Things.
 - SSBMail is a new system. There will be flaws, there always is.

