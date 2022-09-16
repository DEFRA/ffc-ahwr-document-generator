const { models } = require('../data')

const checkEmailComplete = async () => {
  return models.documentLog.findAll({ where: { completed: null, status: 'email-sent' } })
}

const set = async (data, fileName) => {
  const { reference, sbi } = data
  console.log('Updating document log', reference, sbi, fileName)
  return models.documentLog.create({ reference, sbi, data, fileName })
}

const update = async (reference, data) => {
  return models.documentLog.update(data,
    { where: { reference } })
}

module.exports = {
  checkEmailComplete,
  set,
  update
}
