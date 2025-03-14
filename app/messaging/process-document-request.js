import { generateDocument } from '../document/index.js'
import { requestFarmerApplicationEmail } from '../email/request-email.js'
import { validateDocumentRequest } from './document-request-schema.js'

export const processDocumentRequest = async (logger, message, receiver) => {
  try {
    const messageBody = message.body
    if (validateDocumentRequest(logger, messageBody)) {
      logger.setBindings({ reference: messageBody.reference, sbi: messageBody.sbi, crn: messageBody.crn, userType: messageBody.userType })
      const { blob } = await generateDocument(logger, messageBody)
      await requestFarmerApplicationEmail(logger, messageBody, blob)
      await receiver.completeMessage(message)
    } else {
      await receiver.deadLetterMessage(message)
    }
  } catch (err) {
    await receiver.deadLetterMessage(message)
    logger.error(`Unable to complete document generation request: ${err}`)
  }
}
