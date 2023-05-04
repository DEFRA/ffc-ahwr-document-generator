const { checkEmailDelivered } = require('../repositories/document-log-repository')
const { notfiyCheckInterval } = require('../config').notifyConfig
const checkDeliveryStatus = require('./notify-status')
const updateEmailStatus = require('./update-email-status')

const start = async () => {
  try {
    console.log('Checking for messages')
    const documentLogs = await checkEmailDelivered()
    console.log('found', documentLogs.length, 'messages')

    for (const documentLog of documentLogs) {
      const emailReference = documentLog.emailReference
      console.log(`Checking message: ${JSON.stringify({
        reference: documentLog.reference,
        emailReference
      })}`)
      if (emailReference) {
        const status = await checkDeliveryStatus(emailReference)
        updateEmailStatus(documentLog, status)
      }
    }
  } catch (err) {
    console.error(err.message)
  } finally {
    setTimeout(start, notfiyCheckInterval)
  }
}

module.exports = {
  start
}
