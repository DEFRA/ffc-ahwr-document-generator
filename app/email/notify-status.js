const notifyClient = require('./notify-client')

const checkDeliveryStatus = async (emailReference) => {
  const response = await notifyClient.getNotificationById(emailReference)
  return response.data?.status
}

module.exports = checkDeliveryStatus
