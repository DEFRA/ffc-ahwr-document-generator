const createFilename = (data) => {
  return `${data.whichSpecies}/${data.sbi}/${data.reference}.pdf`
}

module.exports = createFilename
