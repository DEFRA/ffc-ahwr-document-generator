const requestedDelivery = {
  deliveryId: 1,
  reference: '123456789',
  method: 'email',
  requested: new Date('2022-01-01'),
  completed: null
}

const completedDelivery = {
  deliveryId: 2,
  reference: '8123456789',
  method: 'email',
  requested: new Date('2022-01-01'),
  completed: new Date('2022-01-01')
}

module.exports = {
  requestedDelivery,
  completedDelivery
}
