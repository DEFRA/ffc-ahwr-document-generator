const { checkEmailComplete, update } = require('../repositories/document-log-repository')
const { notfiyCheckInterval } = require('../config').notifyConfig
const checkDeliveryStatus = require('./notify-status')

const start = async () => {
  try {
    console.log('Checking for messages')
    const documentLogs = await checkEmailComplete()
    console.log('found', documentLogs.length, 'messages')

    for (const documentLog of documentLogs) {
      console.log('Checking message', documentLog.emailReference)
      const status = await checkDeliveryStatus(documentLog.emailReference)
      update(documentLog.reference, { status })
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, notfiyCheckInterval)
  }
}

module.exports = {
  start
}
