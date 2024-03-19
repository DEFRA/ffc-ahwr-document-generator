const notifyClient = require('./notify-client')
const createFileName = require('../document/create-filename')
const { applyServiceUri, claimServiceUri } = require('../config')
const { EMAIL_CREATED } = require('../statuses')
const { SEND_FAILED } = require('./notify-statuses')
const { templateIdFarmerApplicationGeneration, carbonCopyEmailAddress } = require('../config').notifyConfig
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

const sendEmail = async (email, personalisation, reference, templateId) => {
  let success = false
  try {
    const response = await send(templateId, email, { personalisation, reference })
    const emailReference = response.data?.id
    console.log(`Email sent to ${email} for ${reference}`)
    update(reference, { emailReference, status: EMAIL_CREATED })
    await sendCarbonCopy(templateId, { personalisation, reference })
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

const sendCarbonCopy = async (templateId, personalisation) => {
  try {
    if (carbonCopyEmailAddress) {
      await send(
        templateId,
        carbonCopyEmailAddress,
        personalisation
      )
      console.log(`Carbon copy email sent to ${carbonCopyEmailAddress} for ${personalisation.reference}`)
    }
  } catch (error) {
    throw Error(error)
  }
}

const sendFarmerApplicationEmail = async (data, blob) => {
  const filename = createFileName(data)
  console.log(`File contents for ${filename} downloaded`)
  const personalisation = {
    name: data.farmerName,
    reference: data.reference,
    link_to_file: notifyClient.prepareUpload(blob),
    guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
    claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
    claim_uri: claimServiceUri
  }
  if (data?.orgEmail) {
    sendEmail(data.orgEmail, personalisation, data.reference, templateIdFarmerApplicationGeneration)
  }
  return sendEmail(data.email, personalisation, data.reference, templateIdFarmerApplicationGeneration)
}

module.exports = {
  sendFarmerApplicationEmail
}
