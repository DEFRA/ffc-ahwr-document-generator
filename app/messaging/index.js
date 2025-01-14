import { MessageReceiver } from 'ffc-messaging'
import { processDocumentRequest } from './process-document-request.js'
import { appConfig } from '../config/index.js'

const { applicationdDocCreationRequestQueue } = appConfig.messageQueueConfig

let documentGenerationReceiver

export const startMessaging = async () => {
  const documentGenerationAction = (message) => processDocumentRequest(message, documentGenerationReceiver)
  documentGenerationReceiver = new MessageReceiver(applicationdDocCreationRequestQueue, documentGenerationAction)
  await documentGenerationReceiver.subscribe()

  console.info('Ready to receive messages')
}

export const stopMessaging = async () => {
  await documentGenerationReceiver.closeConnection()
}
