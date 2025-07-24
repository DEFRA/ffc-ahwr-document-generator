import { createServer } from '../../../../app/server'
import HttpStatus from 'http-status-codes'
import { redactPII } from '../../../../app/repositories/document-log-repository'
import { deleteBlob } from '../../../../app/storage/deleteBlob'

jest.mock('../../../../app/repositories/document-log-repository')
jest.mock('../../../../app/storage/deleteBlob')

const mockAgreementsToRedact = [{ reference: 'FAKE-REF-1', data: { sbi: 'FAKE-SBI-1' }, redactID: 'FAKE-REDACT-ID-1' }]

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

      expect(deleteBlob).toHaveBeenCalledWith('FAKE-SBI-1/FAKE-REF-1.pdf', expect.any(Object))
      expect(redactPII).toHaveBeenCalledWith('FAKE-REF-1', expect.any(Object))
      expect(res.statusCode).toBe(HttpStatus.OK)
    })
  })
})
