import { notifyClient } from './notify-client'
import { createFileName } from '../document/create-filename'
import { appConfig } from '../config'
import { DOCUMENT_STATUSES, NEW_USER, NOTIFY_STATUSES } from '../constants'
import { update } from '../repositories/document-log-repository'
import appInsights from 'applicationinsights'
import { sendSFDEmail } from './sfd-client'

const { applyServiceUri, claimServiceUri, notifyConfig, sfdMessage } = appConfig
const {
  templateIdFarmerApplicationGenerationNewUser,
  templateIdFarmerApplicationGenerationExistingUser,
  carbonCopyEmailAddress
} = notifyConfig

export const send = async (templateId, email, personalisation) => {
  console.log(`Received email to send to ${email} for ${personalisation.reference}`)
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
      return sendSFDEmail(
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

export const sendEmail = async (email, personalisation, reference, templateId) => {
  let success = false
  try {
    const response = await send(templateId, email, { personalisation, reference })

    if (!sfdMessage.enabled) {
      // If it IS enabled we don't get any of this info as the message proxy is doing the send and audit
      // otherwise do usual audit here
      const emailReference = response.data?.id
      console.log(`Email sent to ${email} for ${reference}`)
      update(reference, { emailReference, status: DOCUMENT_STATUSES.EMAIL_CREATED })
    } else {
      console.log(`Request sent to sfd message proxy for ${reference}`)
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
    update(reference, { status: NOTIFY_STATUSES.SEND_FAILED })
    console.error(`Error occurred sending email to ${email} for ${reference}. Error: ${JSON.stringify(e.response?.data)}`)
    appInsights.defaultClient.trackException({ exception: e })
  }
  return success
}

export const sendCarbonCopy = async (personalisation, reference, templateId) => {
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

export const sendFarmerApplicationEmail = async (data, blob) => {
  console.log(`Sending email for ${data.reference} - ${data.userType} - ${data.email} - ${data.orgEmail}`)
  const filename = createFileName(data)
  console.log(`File contents for ${filename} downloaded`)
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

  const emailAddress = data.email
  const emailTemplateId = data.userType === NEW_USER ? templateIdFarmerApplicationGenerationNewUser : templateIdFarmerApplicationGenerationExistingUser
  let successFullySent = true

  sendCarbonCopy(personalisation, data.reference, emailTemplateId)

  if (data?.orgEmail) {
    successFullySent = await sendEmail(data.orgEmail, personalisation, data.reference, emailTemplateId)
  }

  if (data?.orgEmail && data?.orgEmail !== emailAddress) {
    successFullySent = await sendEmail(emailAddress, personalisation, data.reference, emailTemplateId)
  }

  return successFullySent
}
