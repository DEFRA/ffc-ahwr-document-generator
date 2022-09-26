const { NotifyClient } = require('notifications-node-client')
const { notifyApiKey } = require('../config').notifyConfig

module.exports = new NotifyClient(notifyApiKey)
