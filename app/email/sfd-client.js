const sendMessage = require('../messaging/send-message')
const { sfdRequestMsgType, messageQueueConfig: { sfdMessageQueue } } = require('../config')
const validateSFDClaim = require('../messaging/submit-sfd-schema')
const states = require('../messaging/states')

const sendSFDEmail = async (templateId, email, personalisation) => {
    const { personalisation: { reference, crn, sbi } } = personalisation

    let sfdMessage = {
        crn: crn,
        sbi: sbi,
        agreementReference: reference,
        notifyTemplateId: templateId,
        emailAddress: email,
        customParams: personalisation,
        dateTime: new Date().toISOString()
    }

    if (validateSFDClaim(sfdMessage)) {
        return await sendMessage(sfdMessage, sfdRequestMsgType, sfdMessageQueue)
    } else {
        return sendMessage({ applicationState: states.failed }, sfdRequestMsgType, sfdMessageQueue, { templateId })
    }
}

module.exports = sendSFDEmail