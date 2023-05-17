const generateDocument = require('../document')
const { sendFarmerApplicationEmail } = require('../email/notify-send')
const { validateDocumentRequest } = require('./document-request-schema')

const processDocumentRequest = async (message, receiver) => {
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

module.exports = processDocumentRequest
