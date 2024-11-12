const joi = require('joi')
const { endemics } = require('../config/index')

const eventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  crn: joi.string().required(),
  whichSpecies: joi.string().required(),
  startDate: joi.date().required(),
  email: joi.string().email({ tlds: false }).optional(),
  orgEmail: joi.string().email({ tlds: false }).optional(),
  name: joi.string().optional(),
  farmerName: joi.string().optional()
})

const endemicsEventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  crn: joi.string().required(),
  startDate: joi.date().required(),
  userType: joi.string().optional(),
  email: joi.string().email({ tlds: false }).optional(),
  orgEmail: joi.string().email({ tlds: false }).optional(),
  name: joi.string().optional(),
  farmerName: joi.string().optional()
})

const validateDocumentRequest = (event) => {
  const validate = endemics.enabled ? endemicsEventSchema.validate(event) : eventSchema.validate(event)

  if (validate.error) {
    console.log('Document request validation error', JSON.stringify(validate.error))
    return false
  }

  return true
}

module.exports = { validateDocumentRequest }
