const notifyClient = require('./notify-client')
const createFileName = require('../document/create-filename')
const { applyServiceUri, claimServiceUri, endemics } = require('../config')
const { EMAIL_CREATED } = require('../statuses')
const { SEND_FAILED } = require('./notify-statuses')
const {
  templateIdFarmerApplicationGeneration,
  templateIdFarmerApplicationGenerationNewUser,
  templateIdFarmerApplicationGenerationExistingUser,
  carbonCopyEmailAddress
} = require('../config').notifyConfig
const { update } = require('../repositories/document-log-repository')
const appInsights = require('applicationinsights')

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

const sendEmail = async (email, personalisation, reference, templateId, carbonEmail = false) => {
  let success = false
  try {
    const response = await send(templateId, email, { personalisation, reference })
    const emailReference = response.data?.id
    console.log(`Email sent to ${email} for ${reference}`)
    update(reference, { emailReference, status: EMAIL_CREATED })
    if (carbonEmail) {
      await sendCarbonCopy(templateId, { personalisation, reference }, carbonCopyEmailAddress)
    }
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

const sendCarbonCopy = async (templateId, personalisation, carbonCopyEmailAddress) => {
  try {
    if (carbonCopyEmailAddress) {
      await send(
        templateId,
        carbonCopyEmailAddress,
        personalisation
      )
      console.log(`Carbon copy email sent to ${carbonCopyEmailAddress} for ${personalisation.reference}`)
    }
  } catch (e) {
    console.error(`Error occurred sending carbon email to ${carbonCopyEmailAddress} for ${personalisation.reference}. Error: ${JSON.stringify(e.response?.data)}`)
  }
}

const sendFarmerApplicationEmail = async (data, blob) => {
  console.log(`Sending email for ${data.reference}`)
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

  let emailAddress = data.email
  let emailTemplateId = templateIdFarmerApplicationGeneration
  let carbonEmail = false

  if (data?.orgEmail && data?.orgEmail !== data.email) {
    emailAddress = data.orgEmail
    carbonEmail = true
  }

  if (endemics.enabled) {
    emailTemplateId = data.userType === 'newUser' ? templateIdFarmerApplicationGenerationNewUser : templateIdFarmerApplicationGenerationExistingUser
  }
  return sendEmail(emailAddress, JSON.stringify(personalisation), data.reference, emailTemplateId, carbonEmail)
}

module.exports = {
  sendFarmerApplicationEmail,
  sendCarbonCopy,
  send,
  sendEmail
}
