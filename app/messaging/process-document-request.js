import { generateDocument } from '../document/index.js'
import { sendFarmerApplicationEmail } from '../email/notify-send.js'
import { validateDocumentRequest } from './document-request-schema.js'
import joi from 'joi'
import { enableOrDisableSchedulerWork } from '../email/notify-monitor.js'

export const processDocumentRequest = async (message, receiver) => {
  try {
    const messageBody = message.body
    if (validateNotifySchedulerMessage(messageBody)) {
      enableOrDisableSchedulerWork(messageBody.enableSchedule)
      await receiver.completeMessage(message)
    } else if (validateDocumentRequest(messageBody)) {
      console.log('Received document generation request', JSON.stringify(messageBody))
      const { blob } = await generateDocument(messageBody)
      await sendFarmerApplicationEmail(messageBody, blob)
      await receiver.completeMessage(message)
    }
  } catch (err) {
    await receiver.deadLetterMessage(message)
    console.error('Unable to document generation request:', err.message)
  }
}

const controlNotifySchedulerSchema = joi.object({
  enableSchedule: joi.boolean().required()
})

export const validateNotifySchedulerMessage = (event) => {
  const { error } = controlNotifySchedulerSchema.validate(event)

  if (error) {
    return false
  }
  console.log(`Received a control message for notify scheduler, enableSchedule: ${event.enableSchedule}`)
  return true
}
