import { NotifyClient } from 'notifications-node-client'
import { appConfig } from '../config'

export const notifyClient = new NotifyClient(appConfig.notifyConfig.notifyApiKey)
