# MX mail

MX is an encrypted mail application on a decentralized network.
It's not email, but it's better.

It doesnt work yet though, so dont try to download it.

**Protocols**
 - [Secure Scuttlebutt](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html) p2p signed-log gossip
 - [Secret Handshake](https://scuttlebot.io/more/protocols/secret-handshake.html) transport layer security
 - [Private Box](https://scuttlebot.io/more/protocols/private-box.html) log-entry encryption

![screenshot.png](screenshot.png)


### Encrypted mail on signed logs

MX is a private mail system built on the [secure scuttlebutt signed-log network](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html).

Rather than attempting to route individual messages to specific hosts, SSB writes each users' messages to a single append-only log.
The log is then gossiped uniformly to any peer that's interested in the messages.

Private messages are encrypted with the [private box protocol](https://scuttlebot.io/more/protocols/private-box.html).
Private box hides the data and metadata of the message; it doesn't reveal the message, subject line, or recipients.

When new log-entries are downloaded, interested parties attempt to decrypt with their private key.
If successful, then they know the message was for them; otherwise, the message is ignored (and can be discarded).

SSB log entries are simple JSON, so they are very general and extensible, and can represent more than just mail.
MX uses it for user-profiles, for instance, and to broadcast the social-graph relationships.


### Recipient authentication

MX uses a [web of trust](https://en.wikipedia.org/wiki/Web_of_trust) to authenticate users.
Users follow each other's SSB logs to form a "Cryptographic Social Network."
The "follows" are broadcasted publicly, for everyone to see.
Confidence in identities is created by aggregating positive signals (follows, "verifications") and negative signals (flags) from the user's social graph.


### "Pub" dumb servers

MX runs on the user device, not on a web host.
This is to protect the encryption keys (since browsers cant do that).
It also lets us have offline operation, and better performance, in some cases.

The SSB protocol is peer-to-peer, but there is no global DHT or NAT-traversal system.
Instead we use "Pub servers" on public IPs, and they rehost the users' logs.

Pub servers are unprivileged and not given any trust (nor should they be; most of them are run on cloud VPSes).
They just exist to improve network availability, and to keep users from having to reveal their IPs to each other.
They can not read your mail, because we use end-to-end encryption.
They're basically like other users on the SSB network.

You must register with a Pub to be active on the network.
(If you know how to run nodejs on linux, then it's easy to setup one yourself.)
You can change your pub, or use more than one, without disrupting your account.


### Introduction / user-discovery

The MX protocols (SSB) lack a centralized name registry.
Therefore users have to exchange contact info out-of-band.

[See Ideas: user-directories](#user-directories)


### Automated bot users

Bots are easy to write for MX.
You can use them to create mailing lists, user-directories, and so on.
(Pubs are a kind of bot.)

Documentation is available on the [Scuttlebot site](https://scuttlebot.io/).
(Scuttlebot is a nodejs implementation of the SSB protocol, which MX embeds.)



## Ideas

Some todo ideas for the future.


### Verifications

It'd be useful if we could bind users' MX identities to other accounts, by sharing proofs of key-ownership through them.
This would improve the confidence in user identities.

For instance, you might assert, "I am bob@gmail.com," by publishing the claim on your log.
You'd send that log entry's JSON (which includes your signature) to me via bob@gmail.com.
I would input this proof into MX; I would confirm I received it from bob@gmail.com, and MX would confirm the message matches your log.

Afterward, MX would publish a verification-message on my log, saying that I confirmed your identity.
My followers would add that verification to their evaluation of your account.


### User directories

Taking verifications further, we can use directory-sites -- backed by their own logs -- to improve discovery.

The site would run a service for proving ownership of other accounts (twitter, email, github, etc).

The verifications would be broadcast on an ssb log.
Users could choose to follow the directory, in order to monitor and auto-download contact data.
Alternatively, they could go directly to the directory-site to lookup people.

To keep a directory's log from becoming too large to follow, it might be a good idea to run directories as small communities, or groups.
They might be part of a mailing-list, for instance.
The goal would not to be to create "one directory site to rule them all."

