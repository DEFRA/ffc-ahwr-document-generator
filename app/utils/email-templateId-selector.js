const {
  templateIdFarmerApplicationGeneration,
  templateIdFarmerApplicationGenerationNewUser,
  templateIdFarmerApplicationGenerationExistingUser,
  templateIdFarmerApplicationCompleteExistingUserRejectedWithinTenMonths
} = require('../config').notifyConfig

const getTemplateIdForExistingUserRejectedWithinTenMonths = (
  existingUserRejectedWithinTenMonths
) => {
  return existingUserRejectedWithinTenMonths && templateIdFarmerApplicationCompleteExistingUserRejectedWithinTenMonths
}

const getTemplateIdForNewUser = (userType, existingUserRejectedWithinTenMonths) => {
  return userType === 'newUser' && !existingUserRejectedWithinTenMonths ? templateIdFarmerApplicationGenerationNewUser : null
}

const getTemplateIdForExistingUser = (userType, existingUserRejectedWithinTenMonths) => {
  return userType === 'existingUser' && !existingUserRejectedWithinTenMonths ? templateIdFarmerApplicationGenerationExistingUser : null
}

const getDefaultTemplateId = () => templateIdFarmerApplicationGeneration

const emailTemplateIdSelector = (userType, existingUserRejectedWithinTenMonths) => {
  const getTemplateIdForExistingUserRejectedWithinTenMonthsResult = getTemplateIdForExistingUserRejectedWithinTenMonths(existingUserRejectedWithinTenMonths)
  if (getTemplateIdForExistingUserRejectedWithinTenMonthsResult) return getTemplateIdForExistingUserRejectedWithinTenMonthsResult

  const getTemplateIdForNewUserResult = getTemplateIdForNewUser(userType, existingUserRejectedWithinTenMonths)
  if (getTemplateIdForNewUserResult) return getTemplateIdForNewUserResult

  const getTemplateIdForExistingUserResult = getTemplateIdForExistingUser(userType, existingUserRejectedWithinTenMonths)
  if (getTemplateIdForExistingUserResult) return getTemplateIdForExistingUserResult

  return getDefaultTemplateId()
}

module.exports = emailTemplateIdSelector
