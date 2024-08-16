const emailTemplateIdSelector = require('../app/utils/email-templateId-selector')
const { notifyConfig } = require('../app/config')

describe('emailTemplateIdSelector', () => {
  const {
    templateIdFarmerApplicationGeneration,
    templateIdFarmerApplicationGenerationNewUser,
    templateIdFarmerApplicationGenerationExistingUser,
    templateIdFarmerApplicationCompleteExistingUserRejectedWithinTenMonths
  } = notifyConfig

  test('should return templateIdFarmerApplicationCompleteExistingUserRejectedWithinTenMonths if existingUserRejectedWithinTenMonths is true', () => {
    const userType = 'existingUser'
    const existingUserRejectedWithinTenMonths = true

    const result = emailTemplateIdSelector(userType, existingUserRejectedWithinTenMonths)

    expect(result).toBe(templateIdFarmerApplicationCompleteExistingUserRejectedWithinTenMonths)
  })

  test('should return templateIdFarmerApplicationGenerationNewUser if userType is newUser and existingUserRejectedWithinTenMonths is false', () => {
    const userType = 'newUser'
    const existingUserRejectedWithinTenMonths = false

    const result = emailTemplateIdSelector(userType, existingUserRejectedWithinTenMonths)

    expect(result).toBe(templateIdFarmerApplicationGenerationNewUser)
  })

  test('should return templateIdFarmerApplicationGenerationExistingUser if userType is existingUser and existingUserRejectedWithinTenMonths is false', () => {
    const userType = 'existingUser'
    const existingUserRejectedWithinTenMonths = false

    const result = emailTemplateIdSelector(userType, existingUserRejectedWithinTenMonths)

    expect(result).toBe(templateIdFarmerApplicationGenerationExistingUser)
  })

  test('should return templateIdFarmerApplicationGeneration if none of the conditions are met', () => {
    const userType = ''
    const existingUserRejectedWithinTenMonths = true

    const result = emailTemplateIdSelector(userType, existingUserRejectedWithinTenMonths)

    expect(result).toBe(templateIdFarmerApplicationGeneration)
  })
})
