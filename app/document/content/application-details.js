const moment = require('moment')

const calculateEndDate = (startDate, duration) => {
  return moment(startDate).add(duration, 'months').format('DD/MM/YYYY')
}

const eligibility = (whichSpecies) => {
  const speciesEligibility = {
    beef: '11 or more beef cattle',
    dairy: '11 or more dairy cattle',
    sheep: '21 or more sheep',
    pigs: '51 or more pigs'
  }

  return speciesEligibility[whichSpecies]
}

const applicationDetails = (data) => {
  return {
    stack: [
      { text: `Agreement number: ${data.reference} \n\n` },
      { text: `Agreement holder: ${data.user.farmerName} - ${data.user.sbi} \n\n` },
      { text: `Agreement start date: ${data.startDate} \n\n` },
      { text: `Agreement end date: ${calculateEndDate(data.startDate, 6)} \n\n` },
      { text: `Species to be reviewed: ${data.whichSpecies} \n\n` },
      { text: `You must have a minimum number of animals on the date the vet visits your farm to do the review. do the review. You must have ${eligibility(data.whichSpecies)}\n\n` },
      { text: 'Link to full terms and conditions', link: '#' }
    ]
  }
}

module.exports = applicationDetails
