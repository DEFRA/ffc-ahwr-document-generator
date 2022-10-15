const millimetresToPoints = (millimetres) => {
  return millimetres * 2.835
}

module.exports = {
  default: {
    font: 'Arial',
    fontSize: 14,
    lineHeight: 1.15
  },
  header: {
    fontSize: 24,
    bold: true,
    margin: [0, 10, 0, 10]
  },
  subheader: {
    fontSize: 18
  },
  logo: {
    margin: [0, 0, 0, millimetresToPoints(5)]
  },
  style: {
    margin: [0, 0, 0, 5]
  },
  footer: {
    alignment: 'center',
    fontSize: 8
  }
}
