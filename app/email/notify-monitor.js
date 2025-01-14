import { checkEmailDelivered } from '../repositories/document-log-repository.js'
import { appConfig } from '../config/index.js'
import { checkDeliveryStatus } from './notify-status.js'
import { updateEmailStatus } from './update-email-status.js'

export const start = async () => {
  try {
    console.log('Checking for messages')
    const documentLogs = await checkEmailDelivered()
    console.log('found', documentLogs.length, 'messages')

    for (const documentLog of documentLogs) {
      const emailReference = documentLog.emailReference
      console.log(`Checking message with email reference ${emailReference}.`)
      if (!emailReference) {
        continue
      }
      const status = await checkDeliveryStatus(emailReference)
      updateEmailStatus(documentLog, status)
    }
  } catch (err) {
    console.error(err.message)
  } finally {
    setTimeout(start, Number(appConfig.notifyConfig.notifyCheckInterval))
  }
}
