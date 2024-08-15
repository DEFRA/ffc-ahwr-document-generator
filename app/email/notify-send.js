const notifyClient = require('./notify-client')
const createFileName = require('../document/create-filename')
const { applyServiceUri, claimServiceUri, endemics } = require('../config')
const { EMAIL_CREATED } = require('../statuses')
const { SEND_FAILED } = require('./notify-statuses')
const {
  templateIdFarmerApplicationGeneration,
  templateIdFarmerApplicationGenerationNewUser,
  templateIdFarmerApplicationGenerationExistingUser,
  templateIdFarmerApplicationCompleteExistingUserRejectedWithinTenMonths,
  carbonCopyEmailAddress
} = require('../config').notifyConfig
const { update } = require('../repositories/document-log-repository')
const appInsights = require('applicationinsights')
const emailTemplateIdSelector = require('../utils/email-templateId-selector')

const send = async (templateId, email, personalisation) => {
  console.log(`Received email to send to ${email} for ${personalisation.reference}`)
  try {
    return notifyClient.sendEmail(
      templateId,
      email,
      personalisation
    )
  } catch (error) {
    throw Error(error)
  }
}

const sendEmail = async (email, personalisation, reference, templateId) => {
  let success = false
  try {
    const response = await send(templateId, email, { personalisation, reference })
    const emailReference = response.data?.id
    console.log(`Email sent to ${email} for ${reference}`)
    update(reference, { emailReference, status: EMAIL_CREATED })

    appInsights.defaultClient.trackEvent({
      name: 'email',
      properties: {
        status: success,
        reference,
        email,
        templateId
      }
    })
    success = true
  } catch (e) {
    success = false
    update(reference, { status: SEND_FAILED })
    console.error(`Error occurred sending email to ${email} for ${reference}. Error: ${JSON.stringify(e.response?.data)}`)
    appInsights.defaultClient.trackException({ exception: e })
  }
  return success
}

const sendCarbonCopy = async (personalisation, reference, templateId) => {
  try {
    if (carbonCopyEmailAddress) {
      await send(
        templateId,
        carbonCopyEmailAddress,
        { personalisation, reference }
      )
      console.log(`Carbon copy email sent to ${carbonCopyEmailAddress} for ${reference}`)
    }
  } catch (e) {
    console.error(`Error occurred sending carbon email to ${carbonCopyEmailAddress} for ${reference}. Error: ${JSON.stringify(e.response?.data)}`)
  }
}



// 
const sendFarmerApplicationEmail = async (data, blob) => {
  console.log(`Sending data:  ${JSON.stringify(data)}`)
  console.log(`Sending email for ${data.reference} - ${data.userType} - ${data.email} - ${data.orgEmail} - ${JSON.stringify(data.oldWorldRejectedAgreement10months)}`)
  const filename = createFileName(data)
  console.log(`File contents for ${filename} downloaded`)
  const personalisation = {
    name: data.name,
    reference: data.reference,
    link_to_file: notifyClient.prepareUpload(blob),
    guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
    claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
    claim_uri: claimServiceUri
  }

  const emailAddress = data.email
  let emailTemplateId = templateIdFarmerApplicationGeneration
  let isSuccess = true

  if (endemics.enabled) {
    emailTemplateId =  emailTemplateIdSelector(data.userType, data.oldWorldRejectedAgreement10months?.isValid)

  }

  sendCarbonCopy(personalisation, data.reference, emailTemplateId)

  if (data?.orgEmail) {
    isSuccess = sendEmail(data.orgEmail, personalisation, data.reference, emailTemplateId)
  }

  if (data?.orgEmail && data?.orgEmail !== emailAddress) {
    isSuccess = sendEmail(emailAddress, personalisation, data.reference, emailTemplateId)
  }

  return isSuccess
}

module.exports = {
  sendFarmerApplicationEmail,
  sendCarbonCopy,
  send,
  sendEmail
}
