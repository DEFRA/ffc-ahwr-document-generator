import { buildData } from '../data/index.js'
import { DOCUMENT_STATUSES } from '../constants.js'

const { models } = buildData

export const checkEmailDelivered = async () => {
  return models.documentLog.findAll({ where: { completed: null, status: DOCUMENT_STATUSES.EMAIL_CREATED } })
}

export const set = async (data, fileName) => {
  const { reference, sbi } = data
  return models.documentLog.create({ reference, sbi, data, fileName })
}

export const update = async (reference, data) => {
  return models.documentLog.update(data,
    { where: { reference } })
}
