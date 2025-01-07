import joi from 'joi'

const eventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  crn: joi.string().optional(),
  startDate: joi.date().required(),
  userType: joi.string().optional(),
  email: joi.string().email({ tlds: false }).optional(),
  orgEmail: joi.string().email({ tlds: false }).optional(),
  name: joi.string().optional(),
  farmerName: joi.string().optional()
})

export const validateDocumentRequest = (event) => {
  const validate = eventSchema.validate(event)

  if (validate.error) {
    console.log('Document request validation error', JSON.stringify(validate.error))
    return false
  }

  return true
}
