export const NEW_USER = 'newUser'

export const EXISTING_USER = 'existingUser'

export const DOCUMENT_STATUSES = {
  DOCUMENT_CREATED: 'document-created',
  EMAIL_CREATED: 'email-created',
  EMAIL_DELIVERED: 'email-delivered',
  INVALID_EMAIL: 'email-invalid',
  DELIVERY_FAILED: 'email-delivery-failed',
  NOTIFY_ERROR_RESEND: 'notify-error-resend'
}

export const NOTIFY_STATUSES = {
  SENDING: 'sending',
  SEND_FAILED: 'send-failed',
  DELIVERED: 'delivered',
  PERMANENT_FAILURE: 'permanent-failure',
  TEMPORARY_FAILURE: 'temporary-failure',
  TECHNICAL_FAILURE: 'technical-failure'
}

export const CLAIM_STATES = {
  alreadyClaimed: 'already_claimed',
  alreadySubmitted: 'already_submitted',
  alreadyExists: 'already_exists',
  error: 'error',
  failed: 'failed',
  notFound: 'not_found',
  notSubmitted: 'not_submitted',
  submitted: 'submitted',
  success: 'success'
}
