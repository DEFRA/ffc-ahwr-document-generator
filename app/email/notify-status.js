import { notifyClient } from './notify-client'

export const checkDeliveryStatus = async (emailReference) => {
  const response = await notifyClient.getNotificationById(emailReference) // Does this work? getNotificationById doesnt seem to be a method available on notifyClient
  console.log(response)
  return response.data?.status
}
