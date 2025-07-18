import { createServer } from '../../../../app/server'
import HttpStatus from 'http-status-codes'

const mockAgreementsToRedact = [{ reference: 'FAKE-REF-1', sbi: 'FAKE-SBI-1', redactID: 'FAKE-REDACT-ID-1' }]

describe('redact-pii', () => {
  let server

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  describe('POST /api/redact/pii', () => {
    test('should return OK status when called with agreementsToRedact in payload', async () => {
      const res = await server.inject({ method: 'POST', url: '/api/redact/pii', payload: { agreementsToRedact: mockAgreementsToRedact } })
      expect(res.statusCode).toBe(HttpStatus.OK)
    })
  })
})
