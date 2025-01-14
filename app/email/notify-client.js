import { NotifyClient } from 'notifications-node-client'
import { appConfig } from '../config/index.js'

export const notifyClient = new NotifyClient(appConfig.notifyConfig.notifyApiKey)
