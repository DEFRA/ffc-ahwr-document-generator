const moment = require('moment')
const config = require('../../config')

const calculateEndDate = (startDate, duration) => {
  return moment(startDate).add(duration, 'months').format('D MMMM YYYY')
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
      { text: 'By applying for this funding you have entered into an agreement with the Rural Payments Agency (RPA). The agreement will be governed by the agreed ' },
      { text: 'terms and conditions.\n\n', link: config.termsAndConditionsUrl, decoration: 'underline', color: '#1D70B8' },
      { text: 'Agreement summary \n\n', style: 'subheader' },
      {
        ul: [
          `Agreement number: ${data.reference} \n\n`,
          `Agreement holder: ${data.farmerName} - ${data.sbi} \n\n`,
          `Agreement start date: ${moment(data.startDate).format('D MMMM YYYY')} \n\n`,
          `Agreement end date: ${calculateEndDate(data.startDate, 6)} \n\n`,
          `Type of livestock review: ${data.whichSpecies} \n\n`
        ]
      },
      { text: `You must have a minimum number of animals on the date the vet visits your farm to do the review. You must have ${eligibility(data.whichSpecies)}.\n\n` },
      { text: 'More information\n\n', style: 'subheader' },
      { text: 'For information about what happens during a review and what you need to do, read the ' },
      { text: 'guidance on how to apply for an annual health and welfare review of livestock.\n\n', link: config.applyServiceUri, decoration: 'underline', color: '#1D70B8' },
      { text: 'For information on how to claim, read the ' },
      { text: 'guidance on how to claim funding for an annual health and welfare review of livestock.\n\n', link: config.claimServiceUri, decoration: 'underline', color: '#1D70B8' }
    ]
  }
}

module.exports = applicationDetails
