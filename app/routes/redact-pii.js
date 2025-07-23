import HttpStatus from 'http-status-codes'
import { redactPII } from '../repositories/document-log-repository.js'
import { deleteBlob } from '../storage/deleteBlob.js'

export const redactPiiRequestHandlers = [
  {
    method: 'POST',
    path: '/api/redact/pii',
    handler: async (request, h) => {
      request.logger.info('Request for redact PII received')

      request.payload.agreementsToRedact.forEach(agreementToRedact => {
        deleteBlob(`${agreementToRedact.data.sbi}/${agreementToRedact.reference}.pdf`, request.logger)
        redactPII(agreementToRedact.reference)
      })

      return h.response().code(HttpStatus.OK)
    }
  }
]
