import { checkEmailDelivered } from '../repositories/document-log-repository.js'
import { appConfig } from '../config/index.js'
import { checkDeliveryStatus } from './notify-status.js'
import { updateEmailStatus } from './update-email-status.js'

// Going to default to false as the underlying check is fundamentally broken
// We do have the option to switch back on should we really want to
let schedulerEnabled = false

export const start = async () => {
  try {
    if (schedulerEnabled) {
      console.log('Checking for messages')
      const documentLogs = await checkEmailDelivered()
      console.log('found', documentLogs.length, 'messages')

      for (const documentLog of documentLogs) {
        const emailReference = documentLog.emailReference
        if (!emailReference) {
          continue
        }
        console.log(`Checking message with email reference ${emailReference}.`)
        const status = await checkDeliveryStatus(emailReference)
        await updateEmailStatus(documentLog, status)
      }
    } else {
      console.log('sleeping till next notify interval as scheduler is disabled')
    }
  } catch (err) {
    console.error(err.message)
  } finally {
    setTimeout(start, Number(appConfig.notifyConfig.notifyCheckInterval))
  }
}

export const enableOrDisableSchedulerWork = (enableOrDisable) => {
  schedulerEnabled = enableOrDisable
  if (schedulerEnabled) {
    console.log('Notify scheduler is enabled, will continue to check for message status from next interval')
  } else {
    console.log('Notify scheduler is disabled, will not check for message status until it is enabled again')
  }
}
