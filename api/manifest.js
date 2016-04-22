module.exports = {
  createEventStream: 'source',

  getThread: 'async',
  getIndexCounts: 'async',
  createInboxStream: 'source',
  createChatStream: 'source',
  createCertStream: 'source',
  createNoticeStream: 'source',
  createSearchStream: 'source',

  markRead: 'async',
  markUnread: 'async',
  markAllRead: 'async',
  toggleRead: 'async',
  isRead: 'async',

  addFileToBlobs: 'async',
  saveBlobToFile: 'async',

  useLookupCode: 'source',

  getMyProfile: 'async',
  getProfile: 'async',
  getAllProfiles: 'async',

  getNamesById: 'async',
  getIdsByName: 'async',
  getName: 'async',
  getActionItems: 'async'
}