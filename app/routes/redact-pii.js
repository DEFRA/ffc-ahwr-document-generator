export const redactPiiRequestHandlers = [
  {
    method: 'POST',
    path: '/api/redact/pii',
    handler: async (request, h) => {
      request.logger.info(`Request for redact PII received, agreementsToRedact: ${request.body}`)
      return h.response().code(200)
    }
  }
]
