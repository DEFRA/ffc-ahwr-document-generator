const { models } = require('../data')

const checkEmailDelivered = async () => {
  return models.documentLog.findAll({ where: { completed: null } })
}

const set = async (data, fileName) => {
  const { reference, sbi } = data
  console.log('Updating document log', reference, sbi, fileName)
  return models.documentLog.create({ reference, sbi, data, fileName })
}

const update = async (reference, data) => {
  console.log(`Updating document log: ${JSON.stringify({
    reference,
    data
  })}`)
  return models.documentLog.update(data,
    { where: { reference } })
}

module.exports = {
  checkEmailDelivered,
  set,
  update
}
