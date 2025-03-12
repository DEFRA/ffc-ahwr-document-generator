import { MessageReceiver } from 'ffc-messaging'
import { processDocumentRequest } from './process-document-request.js'
import { appConfig } from '../config/index.js'

const { applicationDocCreationRequestQueue } = appConfig.messageQueueConfig

let documentGenerationReceiver

export const startMessaging = async (logger) => {
  const documentGenerationAction = (message) => {
    const childLogger = logger.child({})
    processDocumentRequest(childLogger, message, documentGenerationReceiver)
  }
  documentGenerationReceiver = new MessageReceiver(applicationDocCreationRequestQueue, documentGenerationAction)
  await documentGenerationReceiver.subscribe()

  logger.info('Ready to receive messages')
}

export const stopMessaging = async () => {
  await documentGenerationReceiver.closeConnection()
}
