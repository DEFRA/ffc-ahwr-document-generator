import joi from 'joi'
import { SUPPORTED_SCHEMES } from 'ffc-ahwr-common-library'

const eventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  crn: joi.string().optional(),
  startDate: joi.date().required(),
  userType: joi.string().optional(),
  email: joi.string().email({ tlds: false }).optional(),
  orgEmail: joi.string().email({ tlds: false }).optional(),
  name: joi.string().optional(),
  farmerName: joi.string().optional(),
  scheme: joi.string().valid(...SUPPORTED_SCHEMES).optional(),
  templateId: joi.string().optional()
})

export const validateDocumentRequest = (logger, event) => {
  const validate = eventSchema.validate(event)

  if (validate.error) {
    logger.error(`Document request validation error: ${JSON.stringify(validate.error)}`)
    return false
  }

  return true
}
