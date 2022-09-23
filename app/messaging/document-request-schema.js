const joi = require('joi')

const eventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  whichSpecies: joi.string().required(),
  startDate: joi.date().required()
})

const validateDocumentRequest = (event) => {
  const validate = eventSchema.validate(event)

  if (validate.error) {
    console.log('Document request validation error', validate.error)
    return false
  }

  return true
}

module.exports = { validateDocumentRequest }
