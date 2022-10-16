const path = require('path')
const imagePath = path.join(__dirname, '../', 'images')
const { millimetresToPoints } = require('../conversion')

const title = () => {
  return {
    stack: [
      { image: `${imagePath}/logo.jpg`, fit: [millimetresToPoints(200), millimetresToPoints(25)], style: 'logo' },
      { text: 'Annual health and welfare review of livestock agreement', style: 'header', alignment: 'left' }
    ]
  }
}

module.exports = title
