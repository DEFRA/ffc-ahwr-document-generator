const notifyClient = require('./notify-client')
const createFileName = require('../document/create-filename')
const { documentContainer } = require('../config').storageConfig
const { applyServiceUri, claimServiceUri } = require('../config')
const { downloadBlob } = require('../storage')
const { EMAIL_CREATED } = require('../statuses')
const { SEND_FAILED } = require('./notify-statuses')
const { templateIdFarmerApplicationGeneration, carbonCopyEmailAddress } = require('../config').notifyConfig
const { update } = require('../repositories/document-log-repository')

const sendEmail = async (email, personalisation, reference, templateId) => {
  console.log(`Sending email to: ${JSON.stringify({
    email,
    reference
  })}`)
  let success = true
  try {
    const response = await notifyClient.sendEmail(
      templateId,
      email,
      {
        personalisation,
        reference
      }
    )
    const emailReference = response.data?.id
    update(reference, { emailReference, status: EMAIL_CREATED })
  } catch (e) {
    success = false
    update(reference, { status: SEND_FAILED, completed: new Date() })
    console.error(`Error while sending email: ${JSON.stringify({
      email,
      reference,
      err: e.response?.data
    })}`)
  }
  return success
}

const sendFarmerApplicationEmail = async (data) => {
  const filename = createFileName(data)
  const contents = await downloadBlob(documentContainer, filename)
  console.log(`File contents for ${filename} downloaded`)
  const personalisation = {
    name: data.farmerName,
    reference: data.reference,
    link_to_file: notifyClient.prepareUpload(contents),
    guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
    claim_uri: claimServiceUri
  }
  if (await sendEmail(data.email, personalisation, data.reference, templateIdFarmerApplicationGeneration)) {
    console.log(`Email sent to: ${JSON.stringify({
      email: data.email,
      reference: data.reference
    })}`)
  }
  if (carbonCopyEmailAddress) {
    if (await sendEmail(carbonCopyEmailAddress, personalisation, data.reference, templateIdFarmerApplicationGeneration)) {
      console.log(`Carbon copy sent to: ${JSON.stringify({
        email: carbonCopyEmailAddress,
        reference: data.reference
      })}`)
    }
  }
}

module.exports = {
  sendFarmerApplicationEmail
}
