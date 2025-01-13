import { notifyClient } from './notify-client'

export const checkDeliveryStatus = async (emailReference) => {
  const response = await notifyClient.getNotificationById(emailReference)
  return response.data?.status
}
