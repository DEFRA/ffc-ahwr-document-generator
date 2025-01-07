import { generateDocument } from '../../../app/document/index'
import { mockRequest } from '../../mocks/data'
import { mockDocumentDefinition } from '../../mocks/document-definition'
import { createDocumentDefinition } from '../../../app/document/document-definition'
import { publishDocument } from '../../../app/document/publish-document'

jest.mock('../../../app/document/document-definition')
jest.mock('../../../app/document/publish-document')

describe('app', () => {
  test('generate document', async () => {
    createDocumentDefinition.mockReturnValue(mockDocumentDefinition)
    await generateDocument(mockRequest)

    await expect(createDocumentDefinition).toHaveBeenCalled()
    await expect(publishDocument).toHaveBeenCalled()
  })
})
