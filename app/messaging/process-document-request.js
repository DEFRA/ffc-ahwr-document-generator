import { generateDocument } from '../document'
import { sendFarmerApplicationEmail } from '../email/notify-send'
import { validateDocumentRequest } from './document-request-schema'

export const processDocumentRequest = async (message, receiver) => {
  try {
    const messageBody = message.body
    if (validateDocumentRequest(messageBody)) {
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
