import { createFileName } from '../document/create-filename.js'
import { appConfig } from '../config/index.js'
import { DOCUMENT_STATUSES, NEW_USER } from '../constants.js'
import { update } from '../repositories/document-log-repository.js'
import appInsights from 'applicationinsights'
import { sendSFDEmailMessage } from './sfd-client.js'

const {
  applyServiceUri, claimServiceUri, templateIdFarmerApplicationGenerationNewUser,
  templateIdFarmerApplicationGenerationExistingUser
} = appConfig

const AddressType = {
  ORG_EMAIL: 'orgEmail',
  EMAIL: 'email',
  CC: 'CC'
}

const sendEmailRequest = async (logger, email, personalisation, reference, crn, sbi, templateId, addressType) => {
  let success = false
  try {
    await sendSFDEmailMessage(logger,
      templateId,
      email,
      personalisation,
      reference,
      crn,
      sbi
    )

    logger.info(`Request sent to sfd message proxy for ${reference} (${addressType})'`)

    appInsights.defaultClient.trackEvent({
      name: 'agreement-email-requested',
      properties: {
        status: success,
        reference,
        addressType,
        templateId
      }
    })
    success = true
  } catch (e) {
    logger.error(`Error occurred requesting email send for ${reference}. Error: ${JSON.stringify(e.response?.data)}`)
    appInsights.defaultClient.trackException({ exception: e })
  }
  return success
}

export const requestFarmerApplicationEmail = async (logger, data, blob) => {
  const { carbonCopyEmailAddress } = appConfig
  const { crn, sbi, name, reference } = data
  const filename = createFileName(data)
  logger.info(`File contents for ${filename} downloaded`)
  const personalisation = {
    name,
    reference,
    link_to_file: prepareUpload(blob),
    guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
    claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
    claim_uri: claimServiceUri
  }

  const { email, orgEmail } = data

  const emailTemplateId = data.userType === NEW_USER ? templateIdFarmerApplicationGenerationNewUser : templateIdFarmerApplicationGenerationExistingUser
  let orgEmailSuccessFullySent = true
  let emailSuccessFullySent = true
  let ccEmailSuccessFullySent = true

  if (carbonCopyEmailAddress) {
    ccEmailSuccessFullySent = await sendEmailRequest(logger, carbonCopyEmailAddress, personalisation, reference, crn, sbi, emailTemplateId, AddressType.CC)
  }

  if (orgEmail) {
    orgEmailSuccessFullySent = await sendEmailRequest(logger, orgEmail, personalisation, reference, crn, sbi, emailTemplateId, AddressType.ORG_EMAIL)
  }

  if (email && email !== orgEmail) {
    emailSuccessFullySent = await sendEmailRequest(logger, email, personalisation, reference, crn, sbi, emailTemplateId, AddressType.EMAIL)
  }

  const allRequestsSuccessful = orgEmailSuccessFullySent && emailSuccessFullySent && ccEmailSuccessFullySent

  await update(reference, { status: allRequestsSuccessful ? DOCUMENT_STATUSES.EMAIL_REQUESTED : DOCUMENT_STATUSES.REQUEST_FAILED })

  return allRequestsSuccessful
}

function prepareUpload (blob) {
  // Temporarily introducing this function to return the file ready to use with notify.
  // Previously the notify client itself provided this. Inside the notify client it does
  // a safety check to ensure file is less than 2Mb. We don't need that as we know our
  // file size is fixed much smaller than this

  return {
    file: blob.toString('base64'),
    is_csv: false,
    confirm_email_before_download: null,
    retention_period: null
  }
}
