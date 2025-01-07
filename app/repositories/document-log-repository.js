import buildData from '../data'

const { models } = buildData

export const checkEmailDelivered = async () => {
  return models.documentLog.findAll({ where: { completed: null } })
}

export const set = async (data, fileName) => {
  const { reference, sbi } = data
  console.log('Updating document log', reference, sbi, fileName)
  return models.documentLog.create({ reference, sbi, data, fileName })
}

export const update = async (reference, data) => {
  return models.documentLog.update(data,
    { where: { reference } })
}
