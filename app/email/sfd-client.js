const sendMessage = require('../messaging/send-message')
const { sfdRequestMsgType, messageQueueConfig: { sfdMessageQueue } } = require('../config')
const validateSFDSchema = require('../messaging/submit-sfd-schema')
const states = require('../messaging/states')

const sendSFDEmail = async (templateId, email, emailInput, crn, sbi) => {
  const { personalisation: { reference } } = emailInput
  const customParams = { ...emailInput.personalisation }

  const sfdMessage = {
    crn,
    sbi,
    agreementReference: reference,
    notifyTemplateId: templateId,
    emailAddress: email,
    customParams,
    dateTime: new Date().toISOString()
  }

  if (validateSFDSchema(sfdMessage)) {
    return sendMessage(sfdMessage, sfdRequestMsgType, sfdMessageQueue)
  } else {
    // Check this because I am not sure why we would still send a request here. Proxy won't handle this
    return sendMessage({ sfdMessage: states.failed }, sfdRequestMsgType, sfdMessageQueue, { templateId })
  }
}

module.exports = sendSFDEmail
