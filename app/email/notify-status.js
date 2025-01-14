import { notifyClient } from './notify-client.js'

export const checkDeliveryStatus = async (emailReference) => {
  const response = await notifyClient.getNotificationById(emailReference)
  return response.data?.status
}
