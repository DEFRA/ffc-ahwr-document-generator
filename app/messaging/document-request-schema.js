const joi = require('joi')
const endemicsEnabled = require('../config/index').endemics.enabled

const eventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  whichSpecies: joi.string().optional(),
  startDate: joi.date().required(),
  userType: joi.string().optional(),
  email: joi.string().email({ tlds: false }).optional(),
  orgEmail: joi.string().email({ tlds: false }).optional(),
  name: joi.string().optional(),
  farmerName: joi.string().optional()
})

const endemicsEventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  startDate: joi.date().required(),
  userType: joi.string().optional(),
  email: joi.string().email({ tlds: false }).optional(),
  orgEmail: joi.string().email({ tlds: false }).optional(),
  name: joi.string().optional(),
  farmerName: joi.string().optional()
})



const validateDocumentRequest = (event) => {
  const validate = endemicsEnabled ? endemicsEventSchema.validate(event) : eventSchema.validate(event)

  if (validate.error) {
    console.log('Document request validation error', JSON.stringify(validate.error))
    return false
  }

  return true
}

module.exports = { validateDocumentRequest }
