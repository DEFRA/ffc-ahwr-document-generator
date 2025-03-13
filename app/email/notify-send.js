import { notifyClient } from './notify-client.js'
import { createFileName } from '../document/create-filename.js'
import { appConfig } from '../config/index.js'
import { DOCUMENT_STATUSES, NEW_USER, NOTIFY_STATUSES } from '../constants.js'
import { update } from '../repositories/document-log-repository.js'
import appInsights from 'applicationinsights'
import { sendSFDEmail } from './sfd-client.js'

const { applyServiceUri, claimServiceUri, notifyConfig, sfdMessage } = appConfig
const {
  templateIdFarmerApplicationGenerationNewUser,
  templateIdFarmerApplicationGenerationExistingUser
} = notifyConfig

const send = async (logger, templateId, email, personalisation) => {
  // sbi and crn were added into personalisation object to get them into here without changing upstream method signatures
  // for the time being we'll pull them out here and send into SFD route where they are needed, and make sure they don't
  // go into the old route where they aren't needed
  const { crn, sbi, ...filteredPersonalisation } = personalisation.personalisation
  const copyOfPersonalisation = {
    ...personalisation,
    personalisation: filteredPersonalisation
  }

  try {
    if (sfdMessage.enabled) {
      return sendSFDEmail(logger,
        templateId,
        email,
        copyOfPersonalisation,
        crn,
        sbi
      )
    }
    return notifyClient.sendEmail(
      templateId,
      email,
      copyOfPersonalisation
    )
  } catch (error) {
    throw Error(error)
  }
}

export const sendEmail = async (logger, email, personalisation, reference, templateId) => {
  let success = false
  try {
    const response = await send(logger, templateId, email, { personalisation, reference })

    if (!sfdMessage.enabled) {
      // If it IS enabled we don't get any of this info as the message proxy is doing the send and audit
      // otherwise do usual audit here
      const emailReference = response.data?.id
      logger.info(`Email sent for ${reference}`)
      await update(reference, { emailReference, status: DOCUMENT_STATUSES.EMAIL_CREATED })
    } else {
      logger.info(`Request sent to sfd message proxy for ${reference}`)
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
    await update(reference, { status: NOTIFY_STATUSES.SEND_FAILED })
    logger.error(`Error occurred sending email for ${reference}. Error: ${JSON.stringify(e.response?.data)}`)
    appInsights.defaultClient.trackException({ exception: e })
  }
  return success
}

const sendCarbonCopy = async (logger, personalisation, reference, templateId) => {
  const { carbonCopyEmailAddress } = notifyConfig
  try {
    if (carbonCopyEmailAddress) {
      await send(
        logger,
        templateId,
        carbonCopyEmailAddress,
        { personalisation, reference }
      )
      logger.info(`Carbon copy email sent for ${reference}`)
    }
  } catch (e) {
    logger.error(`Error occurred sending carbon email for ${reference}. Error: ${JSON.stringify(e.response?.data)}`)
  }
}

export const sendFarmerApplicationEmail = async (logger, data, blob) => {
  const filename = createFileName(data)
  logger.info(`File contents for ${filename} downloaded`)
  const personalisation = {
    name: data.name,
    reference: data.reference,
    link_to_file: notifyClient.prepareUpload(blob),
    guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
    claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
    claim_uri: claimServiceUri,
    crn: data.crn,
    sbi: data.sbi
  }

  const { email, orgEmail } = data

  const emailTemplateId = data.userType === NEW_USER ? templateIdFarmerApplicationGenerationNewUser : templateIdFarmerApplicationGenerationExistingUser
  let orgEmailSuccessFullySent = true
  let emailSuccessFullySent = true

  await sendCarbonCopy(logger, personalisation, data.reference, emailTemplateId)

  if (orgEmail) {
    orgEmailSuccessFullySent = await sendEmail(logger, orgEmail, personalisation, data.reference, emailTemplateId)
  }

  if (email && email !== orgEmail) {
    emailSuccessFullySent = await sendEmail(logger, email, personalisation, data.reference, emailTemplateId)
  }

  logger.info(`Email sent to orgEmail: ${orgEmailSuccessFullySent}, email: ${emailSuccessFullySent}`)

  return orgEmailSuccessFullySent && emailSuccessFullySent
}
