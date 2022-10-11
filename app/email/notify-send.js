const notifyClient = require('./notify-client')
const createFileName = require('../document/create-filename')
const { documentContainer } = require('../config').storageConfig
const { applyServiceUri, claimServiceUri } = require('../config')
const { downloadBlob } = require('../storage')
const { EMAIL_CREATED, SEND_FAILED } = require('../statuses')
const { templateIdFarmerApplicationGeneration, carbonCopyEmailAddress } = require('../config').notifyConfig
const { update } = require('../repositories/document-log-repository')

const send = async (templateId, email, personalisation) => {
  return notifyClient.sendEmail(
    templateId,
    email,
    personalisation
  )
}

const sendEmail = async (email, personalisation, reference, templateId) => {
  let success = true
  try {
    const response = await send(templateId, email, { personalisation, reference })
    const emailReference = response.data?.id
    console.log('Email sent', emailReference, reference)
    update(reference, { emailReference, status: EMAIL_CREATED })
    await sendCarbonCopy(templateId, { personalisation, reference })
  } catch (e) {
    success = false
    update(reference, { status: SEND_FAILED })
    console.error('Error occurred during sending email', e.response?.data)
  }
  return success
}

const sendCarbonCopy = async (templateId, personalisation) => {
  if (carbonCopyEmailAddress) {
    await send(
      templateId,
      carbonCopyEmailAddress,
      personalisation
    )

    console.log(`Carbon copy email sent to ${carbonCopyEmailAddress} for ${personalisation.reference}`)
  }
}

const sendFarmerApplicationEmail = async (data) => {
  const contents = await downloadBlob(documentContainer, createFileName(data))
  const personalisation = {
    name: data.user.farmerName,
    reference: data.reference,
    link_to_file: notifyClient.prepareUpload(contents),
    guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
    claim_uri: claimServiceUri
  }
  return sendEmail(data.user.email, personalisation, data.reference, templateIdFarmerApplicationGeneration)
}

module.exports = {
  sendFarmerApplicationEmail
}
