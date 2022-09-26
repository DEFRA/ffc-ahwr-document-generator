
const mockData = require('../../mocks/data')

const { downloadBlob } = require('../../../app/storage')
jest.mock('../../../app/storage')

jest.mock('../../../app/repositories/document-log-repository', () => {
  return {
    update: jest.fn()
  }
})

const notifyClient = require('../../../app/email/notify-client')
jest.mock('../../../app/email/notify-client')

const { sendFarmerApplicationEmail } = require('../../../app/email/notify-send')

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')

const notifyResponseId = '123456789'

describe('notify send email messages', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('send farmer application email - successful email send', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    downloadBlob.mockResolvedValue(mockData)
    const response = await sendFarmerApplicationEmail(mockData)
    expect(consoleLog).toHaveBeenCalledWith('Email sent', '123456789', 'AHWR-1234-5678')
    expect(response).toEqual(true)
  })

  test('send farmer application email - error raised', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
    downloadBlob.mockResolvedValue(mockData)
    const response = await sendFarmerApplicationEmail(mockData)
    expect(consoleError).toHaveBeenCalledWith('Error occurred during sending email', undefined)
    expect(response).toEqual(false)
  })
})
