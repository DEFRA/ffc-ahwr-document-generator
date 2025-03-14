import { sendMessage } from '../messaging/send-message.js'
import { appConfig } from '../config/index.js'
import { validateSFDSchema } from '../messaging/submit-sfd-schema.js'

const { sfdRequestMsgType, messageQueueConfig: { sfdMessageQueue } } = appConfig

export const sendSFDEmailMessage = async (logger, templateId, emailAddress, customParams, reference, crn, sbi) => {
  const sfdMessage = {
    crn,
    sbi,
    agreementReference: reference,
    notifyTemplateId: templateId,
    emailAddress,
    customParams,
    dateTime: new Date().toISOString()
  }

  if (validateSFDSchema(logger, sfdMessage)) {
    await sendMessage(sfdMessage, sfdRequestMsgType, sfdMessageQueue)
  } else {
    throw new Error('SFD validation error')
  }
}
