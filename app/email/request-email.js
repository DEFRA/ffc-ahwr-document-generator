import { appConfig } from '../config/index.js'
import { DOCUMENT_STATUSES, NEW_USER } from '../constants.js'
import { update } from '../repositories/document-log-repository.js'
import appInsights from 'applicationinsights'
import { sendSFDEmailMessage } from './sfd-client.js'
import { AHWR_SCHEME } from 'ffc-ahwr-common-library'

const {
  applyServiceUri, claimServiceUri, templateIdFarmerApplicationGenerationNewUser,
  templateIdFarmerApplicationGenerationExistingUser
} = appConfig

const AddressType = {
  ORG_EMAIL: 'orgEmail',
  EMAIL: 'email',
  CC: 'CC'
}

const sendEmailRequest = async (requestParams) => {
  const { logger, emailAddress, personalisation, reference, crn, sbi, templateId, addressType } = requestParams

  let success = false
  try {
    await sendSFDEmailMessage(logger,
      templateId,
      emailAddress,
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
    logger.error(`Error occurred requesting email send for ${reference}. Error: ${e}`)
    appInsights.defaultClient.trackException({ exception: e })
  }
  return success
}

export const requestFarmerApplicationEmail = async (logger, data, blob) => {
  const { carbonCopyEmailAddress } = appConfig
  const { crn, sbi, reference, email, orgEmail, scheme } = data

  let allEmailsRequested = true

  const requestParams = { logger, crn, sbi, ...generateRequestParams(scheme, reference, data, blob) }

  if (carbonCopyEmailAddress) {
    allEmailsRequested = await sendEmailRequest({ ...requestParams, emailAddress: carbonCopyEmailAddress, addressType: AddressType.CC })
  }

  if (orgEmail) {
    allEmailsRequested = await sendEmailRequest({ ...requestParams, emailAddress: orgEmail, addressType: AddressType.ORG_EMAIL }) && allEmailsRequested
  }

  if (email && email !== orgEmail) {
    allEmailsRequested = await sendEmailRequest({ ...requestParams, emailAddress: email, addressType: AddressType.EMAIL }) && allEmailsRequested
  }

  await update(reference, { status: allEmailsRequested ? DOCUMENT_STATUSES.EMAIL_REQUESTED : DOCUMENT_STATUSES.REQUEST_FAILED })

  return allEmailsRequested
}

const generateRequestParams = (scheme, reference, data, blob) => {
  return customisedEmailRequestMap.get(scheme ?? 'default')(reference, data, blob)
}

const generateDefaultRequestParams = (reference, data, blob) => {
  const { name, userType, templateId } = data

  const personalisation = {
    name,
    reference,
    link_to_file: prepareUpload(blob),
    guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
    claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
    claim_uri: claimServiceUri
  }

  const templateIdToUse = templateId ?? (userType === NEW_USER ? templateIdFarmerApplicationGenerationNewUser : templateIdFarmerApplicationGenerationExistingUser)

  return { personalisation, reference, templateId: templateIdToUse }
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

const customisedEmailRequestMap = new Map([
  ['default', generateDefaultRequestParams],
  [AHWR_SCHEME, generateDefaultRequestParams]
])
