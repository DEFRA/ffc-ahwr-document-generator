const joi = require('joi')

const eventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  whichSpecies: joi.string().required(),
  startDate: joi.date().required(),
  email: joi.string().email({ tlds: false }).optional(),
  farmerName: joi.string().optional()
})

const validateDocumentRequest = (event) => {
  const validate = eventSchema.validate(event)

  if (validate.error) {
    console.log('Document request validation error', JSON.stringify(validate.error))
    return false
  }

  return true
}

module.exports = { validateDocumentRequest }
