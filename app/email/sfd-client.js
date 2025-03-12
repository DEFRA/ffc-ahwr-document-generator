import { sendMessage } from '../messaging/send-message.js'
import { appConfig } from '../config/index.js'
import { validateSFDSchema } from '../messaging/submit-sfd-schema.js'
import { CLAIM_STATES } from '../constants.js'

const { sfdRequestMsgType, messageQueueConfig: { sfdMessageQueue } } = appConfig

export const sendSFDEmail = async (logger, templateId, email, emailInput, crn, sbi) => {
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

  if (validateSFDSchema(logger, sfdMessage)) {
    return sendMessage(sfdMessage, sfdRequestMsgType, sfdMessageQueue)
  }

  // Check this because I am not sure why we would still send a request here. Proxy won't handle this
  return sendMessage({ sfdMessage: CLAIM_STATES.failed }, sfdRequestMsgType, sfdMessageQueue, { templateId })
}
