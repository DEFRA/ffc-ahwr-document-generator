const generateDocument = require('../../../app/document/index')
const mockData = require('../../mocks/data')
const mockDocumentDefinitionData = require('../../mocks/document-definition')
jest.mock('../../../app/document/document-definition')
const mockCreateDocumentDefinition = require('../../../app/document/document-definition')
jest.mock('../../../app/document/publish-document')
const mockPublishDocument = require('../../../app/document/publish-document')
const consoleLog = jest.spyOn(console, 'log')

describe('app', () => {
  test('generate document', async () => {
    mockCreateDocumentDefinition.mockReturnValue(mockDocumentDefinitionData)
    await generateDocument(mockData)

    await expect(mockCreateDocumentDefinition).toHaveBeenCalled()
    await expect(mockPublishDocument).toHaveBeenCalled()
    expect(consoleLog).toHaveBeenNthCalledWith(1, 'Document definition created')
    expect(consoleLog).toHaveBeenNthCalledWith(2, 'Document PDF created')
    expect(consoleLog).toHaveBeenNthCalledWith(3, 'Document published')
  })
})
