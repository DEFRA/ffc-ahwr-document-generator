import { NOTIFY_STATUSES, DOCUMENT_STATUSES } from '../constants'
import { sendFarmerApplicationEmail } from './notify-send'
import { update } from '../repositories/document-log-repository'

const { DELIVERED, PERMANENT_FAILURE, TEMPORARY_FAILURE, TECHNICAL_FAILURE } = NOTIFY_STATUSES
const { EMAIL_DELIVERED, INVALID_EMAIL, DELIVERY_FAILED, NOTIFY_ERROR_RESEND } = DOCUMENT_STATUSES

export const updateEmailStatus = async (documentLog, status) => {
  const { reference } = documentLog

  switch (status) {
    case DELIVERED:
      await update(reference, { status: EMAIL_DELIVERED, completed: new Date() })
      break
    case PERMANENT_FAILURE:
      await update(reference, { status: INVALID_EMAIL, completed: new Date() })
      break
    case TEMPORARY_FAILURE:
      await update(reference, { status: DELIVERY_FAILED, completed: new Date() })
      break
    case TECHNICAL_FAILURE:
      await update(reference, { status: NOTIFY_ERROR_RESEND })
      await sendFarmerApplicationEmail(documentLog.data)
      break
    default:
      console.error('Unknown status')
      break
  }
}
