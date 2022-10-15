const moment = require('moment')
const config = require('../../config')
const guidanceUri = `${config.applyServiceUri}/guidance-for-farmers`

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
      { text: 'You have applied for funding for a review.\n\n' },
      { text: 'By applying for this funding you’ve entered into an agreement with the Rural Payments Agency (RPA). The agreement will be governed by the agreed terms and conditions.\n\n' },
      { text: 'Agreement summary \n\n', style: 'subheader' },
      { text: 'Here are the following details:\n\n' },
      {
        ul: [
          `Agreement number: ${data.reference} \n\n`,
          `Agreement holder: ${data.user.farmerName} - ${data.user.sbi} \n\n`,
          `Agreement start date: ${moment(data.startDate).format('DD/MM/YYYY')} \n\n`,
          `Agreement end date: ${calculateEndDate(data.startDate, 6)} \n\n`,
          `Type of livestock review: ${data.whichSpecies} \n\n`
        ]
      },
      { text: `You must have a minimum number of animals on the date the vet visits your farm to do the review. You must have ${eligibility(data.whichSpecies)}.\n\n` },
      { text: 'Terms and conditions \n\n'},
      { text: `${config.termsAndConditionsUrl}\n\n`, link: config.termsAndConditionsUrl },
      { text: 'Guidance \n\n', link: config.applyServiceUri },
      { text: `${guidanceUri}\n\n`, link: guidanceUri }
    ]
  }
}

module.exports = applicationDetails
