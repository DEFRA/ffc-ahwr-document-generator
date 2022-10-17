const CONVERSION_RATE = 2.835

const millimetresToPoints = (millimetres) => {
  return millimetres * CONVERSION_RATE
}

module.exports = {
  millimetresToPoints
}
