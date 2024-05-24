const path = require('path')
const { endemics, applyServiceUri } = require('../../config')
const imagePath = path.join(__dirname, '../', 'images')
const { millimetresToPoints } = require('../conversion')

const title = () => {
  const titleEndemicsOn = 'Agreement summary: get funding to improve animal health and welfare'
  const titleEndemicsOff = 'Annual health and welfare review of livestock agreement summary'
  return {
    stack: [
      { image: `${imagePath}/logo.jpg`, fit: [millimetresToPoints(200), millimetresToPoints(25)], style: 'logo', link: applyServiceUri },
      { text: endemics.enabled ? titleEndemicsOn : titleEndemicsOff, style: 'header', alignment: 'left' }
    ]
  }
}

module.exports = title
