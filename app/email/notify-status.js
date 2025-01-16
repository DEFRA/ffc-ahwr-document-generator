import { notifyClient } from './notify-client.js'

export const checkDeliveryStatus = async (emailReference) => {
  // this will throw for any status >= 300, so we should be catching 404s and handling appropriately
  // however we have decided not to fix this now as it's been broken for 2 years and we're moving to
  // SFD to send all messages
  const response = await notifyClient.getNotificationById(emailReference)
  return response.data?.status
}
