const { getBySbi } = require('../user')
const generateDocument = require('../document')
const { sendFarmerApplicationEmail } = require('../email/notify-send')
const { validateDocumentRequest } = require('./document-request-schema')

const processDocumentRequest = async (message, receiver) => {
  try {
    const messageBody = message.body

    if (validateDocumentRequest(messageBody)) {
      console.log('Received document generation request', messageBody)
      const user = await getBySbi(messageBody.sbi)

      if (user) {
        messageBody.user = user
        console.log('User found', messageBody)
        await generateDocument(messageBody)
        await sendFarmerApplicationEmail(messageBody)
        await receiver.completeMessage(message)
      } else {
        console.log('User not found', messageBody)
        await await receiver.deadLetterMessage(message)
      }
    }
  } catch (err) {
    await receiver.deadLetterMessage(message)
    console.error('Unable to document generation request:', err)
  }
}

module.exports = processDocumentRequest
