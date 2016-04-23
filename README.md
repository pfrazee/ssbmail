# MX mail

MX is an encrypted mail network.
It's not email, it's better!
But it's not finished yet, so dont try to download it.

![screenshot.png](screenshot.png)

## Secure mail, dumb hosts

MX is end-to-end encrypted mail.
Your private messages are unreadable, except to the recipients.

MX's user-authentication does not depend on a third party.
You collect proofs of identity from a social web-of-trust, and those proofs are stored on your device.

MX's protocol is extensible; the messages are semi-structured (as JSON) and typed.
You can use it to write applications other than just mail.

MX's servers, called Pubs, are dumb-servers for smart-clients.
They handle very basic tasks, like log- and file-replication.

**Protocol reference**
 - [Secure Scuttlebutt](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html) p2p signed-log gossip
 - [Secret Handshake](https://scuttlebot.io/more/protocols/secret-handshake.html) transport layer security
 - [Private Box](https://scuttlebot.io/more/protocols/private-box.html) log-entry encryption
 - [Scuttlebot API](https://scuttlebot.io/) the embedded database/networking stack

### Signed logs

MX is built on the [secure scuttlebutt signed-log network](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html).
It is a decentralized network.

Rather than attempting to route individual messages to specific hosts, MX writes the user's messages to an append-only log.
Each user has its own log, identified by the public key.
The log is then gossiped uniformly to any peer that's interested in the messages.


### Encrypted mail

Private messages are encrypted onto the log with the [private box protocol](https://scuttlebot.io/more/protocols/private-box.html).
Private-box hides the data and metadata of the message; it doesn't reveal the content, subject line, or recipients.

When each log-entry is downloaded, the log's followers attempt to decrypt it with their private key.
If successful, then the the follower knows the message was for them; otherwise, the message is ignored (and can be discarded).

SSB log entries are simple JSON with a 'type' field, and can represent more than just mail.
MX uses it for user-profiles, for instance, and to broadcast the social-graph relationships.


### Recipient authentication

MX uses a [web of trust](https://en.wikipedia.org/wiki/Web_of_trust) to authenticate users.
Users follow each other's SSB logs to form a "cryptographic social network."
The follows are broadcasted publicly, for everyone to see.
Confidence in identities is created by aggregating positive signals (follows, "verifications") and negative signals (flags) from the user's social graph.


### Explicit following

MX only allows users that you follow to message you.
This stops spam from reaching your inbox.


### "Pub" dumb servers

MX runs on the user device, not on a web host.
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
You can change your pub, or use more than one, without disrupting your account.


### Introduction / user-discovery

The MX protocols (SSB) lack a centralized name registry.
Therefore users have to exchange contact info out-of-band.
MX gives a UI control for doing so.

The contact info includes 4 pieces of information, formatted as follows:

```
{user-pubkey}:via:{pubserver-hostname}:{pubserver-port}:{pubserver-pubkey}
```

It tends to be ~130 characters long.


### Automated bot users

Bots are easy to write for MX.
You can use them to create mailing lists, user-directories, and so on.
(Pubs are a kind of bot.)
Documentation is available on the [Scuttlebot site](https://scuttlebot.io/) (Scuttlebot is the engine behind MX).


---


Some todo ideas for the future.


### Verifications

It'd be useful if we could bind users' MX identities to other accounts, by sharing proofs of key-ownership through them.
This would improve the confidence in user identities.

For instance, you might assert, "I am bob@gmail.com," by publishing the claim on your log.
You'd send that log entry's JSON (which includes your signature) to Alice via bob@gmail.com.
Alice would input this proof into MX; Alice would confirm she received it from bob@gmail.com, and MX would confirm the message matches your log.

Afterward, MX would publish a verification-message on Alice's log, saying that she confirmed your identity.
Alice's followers would add that verification to their evaluation of your account.


### User directories

We can use directory-sites -- backed by their own logs -- to improve discovery.

The site would run a service for proving ownership of other accounts (twitter, email, github, etc).
The verifications would be broadcast on an ssb log.
Users could choose to follow the directory, in order to monitor and auto-download contact data.
Alternatively, they could go directly to the directory-site to lookup people.
A directory site might simply aggregate the data from multiple directory logs.

To keep a directory's log from becoming too large to follow, it might be a good idea to run directories as small communities, or groups.
They might be part of a mailing-list, for instance.
The goal would not to be to create "one directory site to rule them all."
The goal is to serve communities which have the social connectedness to verify and monitor each other.

