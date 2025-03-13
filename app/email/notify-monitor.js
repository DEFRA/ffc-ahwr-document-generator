import { checkEmailDelivered } from '../repositories/document-log-repository.js'
import { appConfig } from '../config/index.js'
import { checkDeliveryStatus } from './notify-status.js'
import { updateEmailStatus } from './update-email-status.js'

// Going to default to false as the underlying check is fundamentally broken
// We do have the option to switch back on should we really want to
let schedulerEnabled = false
let logger

export const setLoggerInstance = (loggerInstance) => {
  logger = loggerInstance
}

export const start = async () => {
  try {
    if (schedulerEnabled) {
      logger.info('Checking for messages')
      const documentLogs = await checkEmailDelivered()
      logger.info(`found ${documentLogs.length} messages`)

      for (const documentLog of documentLogs) {
        const emailReference = documentLog.emailReference
        if (!emailReference) {
          continue
        }
        logger.info(`Checking message with email reference ${emailReference}.`)
        const status = await checkDeliveryStatus(emailReference)
        await updateEmailStatus(logger, documentLog, status)
      }
    } else {
      logger.info('sleeping till next notify interval as scheduler is disabled')
    }
  } catch (err) {
    logger.error(err.message)
  } finally {
    setTimeout(start, Number(appConfig.notifyConfig.notifyCheckInterval))
  }
}

export const enableOrDisableSchedulerWork = (logger, enableOrDisable) => {
  schedulerEnabled = enableOrDisable
  if (schedulerEnabled) {
    logger.info('Notify scheduler is enabled, will continue to check for message status from next interval')
  } else {
    logger.info('Notify scheduler is disabled, will not check for message status until it is enabled again')
  }
}
