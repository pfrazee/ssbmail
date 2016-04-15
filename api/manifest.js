module.exports = {
  createEventStream: 'source',

  getIndexCounts: 'async',
  createInboxStream: 'source',
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