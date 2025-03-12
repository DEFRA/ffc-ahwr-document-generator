import { generateDocument } from '../document/index.js'
import { sendFarmerApplicationEmail } from '../email/notify-send.js'
import { validateDocumentRequest } from './document-request-schema.js'
import joi from 'joi'
import { enableOrDisableSchedulerWork } from '../email/notify-monitor.js'

export const processDocumentRequest = async (logger, message, receiver) => {
  try {
    const messageBody = message.body
    if (validateNotifySchedulerMessage(logger, messageBody)) {
      enableOrDisableSchedulerWork(logger, messageBody.enableSchedule)
      await receiver.completeMessage(message)
    } else if (validateDocumentRequest(logger, messageBody)) {
      logger.setBindings({ reference: messageBody.reference, sbi: messageBody.sbi, crn: messageBody.crn, userType: messageBody.userType })
      const { blob } = await generateDocument(logger, messageBody)
      await sendFarmerApplicationEmail(logger, messageBody, blob)
      await receiver.completeMessage(message)
    }
  } catch (err) {
    await receiver.deadLetterMessage(message)
    logger.error(`Unable to complete document generation request: ${err}`)
  }
}

const controlNotifySchedulerSchema = joi.object({
  enableSchedule: joi.boolean().required()
})

export const validateNotifySchedulerMessage = (logger, event) => {
  const { error } = controlNotifySchedulerSchema.validate(event)

  if (error) {
    return false
  }
  logger.info(`Received a control message for notify scheduler, enableSchedule: ${event.enableSchedule}`)
  return true
}
