import HttpStatus from 'http-status-codes'
import { redactPII } from '../repositories/document-log-repository.js'
import { deleteBlob } from '../storage/deleteBlob.js'

export const redactPiiRequestHandlers = [
  {
    method: 'POST',
    path: '/api/redact/pii',
    handler: async (request, h) => {
      request.logger.info('Request for redact PII received')

      await Promise.all(
        request.payload.agreementsToRedact.map(async (agreementToRedact) => {
          await deleteBlob(`${agreementToRedact.sbi}/${agreementToRedact.reference}.pdf`, request.logger)
          await redactPII(agreementToRedact.reference, agreementToRedact.redactedSbi, request.logger)
        }))

      return h.response().code(HttpStatus.OK)
    }
  }
]
