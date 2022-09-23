const { DELIVERED, PERMANENT_FAILURE, TEMPORARY_FAILURE, TECHNICAL_FAILURE } = require('./notify-statuses')
const { EMAIL_DELIVERED, INVALID_EMAIL, DELIVERY_FAILED, NOTIFY_ERROR_RESEND } = require('../statuses')
const { sendFarmerApplicationEmail } = require('./notify-send')
const { update } = require('../repositories/document-log-repository')

const updateEmailStatus = async (documentLog, status) => {
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

module.exports = updateEmailStatus
