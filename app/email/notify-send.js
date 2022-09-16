const notifyClient = require('./notify-client')
const createFileName = require('../document/create-filename')
const { documentContainer } = require('../config').storageConfig
const { downloadBlob } = require('../storage')
const { templateIdFarmerApplicationGeneration } = require('../config').notifyConfig
const { update } = require('../repositories/document-log-repository')

const sendEmail = async (email, personalisation, reference, templateId) => {
  let success = true
  try {
    const response = await notifyClient.sendEmail(
      templateId,
      email,
      { personalisation, reference }
    )
    const emailReference = response.data?.id
    update(reference, { emailReference, status: 'email-sent' })
  } catch (e) {
    success = false
    update(reference, { status: 'email-failed' })
    console.error('Error occurred during sending email', e.response.data)
  }
  return success
}

const sendFarmerApplicationEmail = async (data) => {
  const contents = await downloadBlob(documentContainer, createFileName(data))
  const personalisation = { name: data.user.farmerName, reference: data.reference, link_to_file: notifyClient.prepareUpload(contents) }
  return sendEmail(data.user.email, personalisation, data.reference, templateIdFarmerApplicationGeneration)
}

module.exports = {
  sendFarmerApplicationEmail
}
