const moment = require('moment')
const { endemics, termsAndConditionsUrl, applyServiceUri } = require('../../config')

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
  const applicationDetailsEndemicsOn = {
    stack: [
      { text: 'You have applied for funding for:', margin: [0, 10, 0, 6] },
      {
        ul: [
          { text: 'animal health and welfare reviews', link: '#', decoration: 'underline', color: '#1D70B8', margin: [15, 0, 0, 5] },
          { text: 'endemic disease follow-ups', link: '#', decoration: 'underline', color: '#1D70B8', margin: [15, 0, 0, 5] }
        ]
      },
      { text: ['By applying for this ', { text: 'funding', link: '#', decoration: 'underline', color: '#1D70B8' }, { text: ' you have entered into an agreement with the Rural Payments Agency.' }], margin: [0, 20, 0, 10] },
      { text: [{ text: 'The agreement will be governed by the ' }, { text: 'terms and conditions.', link: termsAndConditionsUrl, decoration: 'underline', color: '#1D70B8' }] },
      { text: 'Agreement details', style: 'subheader', margin: [0, 20, 0, 7] },
      {
        ul: [
          { text: `Agreement number: ${data.reference}`, margin: [15, 0, 0, 5] },
          { text: `Agreement holder: ${data.name} - ${data.sbi}`, margin: [15, 0, 0, 5] },
          { text: `Agreement start date: ${moment(data.startDate).format('D MMMM YYYY')} `, margin: [15, 0, 0, 5] },
          { text: `Agreement end date: ${calculateEndDate(data.startDate, 6)}`, margin: [15, 0, 0, 0] }
        ]
      },
      { text: 'Important requirements', style: 'subheader', margin: [0, 20, 0, 7] },
      { text: 'You must:', margin: [0, 0, 0, 6] },
      {
        ul: [
          { text: 'do all your reviews and follow-ups on the same species', margin: [15, 0, 0, 5] },
          { text: ['have the ', { text: 'minimum number of the livestock', link: '#', decoration: 'underline', color: '#1D70B8' }, ' each time you do a review or follow-up'], margin: [15, 0, 0, 5] },
          { text: ['follow the rules for ', { text: 'timing of reviews and follow-ups', link: '#', decoration: 'underline', color: '#1D70B8' }], margin: [15, 0, 0, 0] }
        ]
      },
      { text: 'Guidance', style: 'subheader', margin: [0, 20, 0, 7] },
      {
        ul: [
          { text: 'Get finding to improve animal health and welfare', link: '#', decoration: 'underline', color: '#1D70B8', margin: [15, 0, 0, 0] }
        ]
      }
    ]
  }
  const applicationDetailsEndemicsOff = {
    stack: [
      { text: 'You have applied for funding for a review.\n\n' },
      { text: 'By applying for this funding you have entered into an agreement with the Rural Payments Agency (RPA). The agreement will be governed by the agreed ' },
      { text: 'terms and conditions.\n\n', link: termsAndConditionsUrl, decoration: 'underline', color: '#1D70B8' },
      { text: 'Agreement summary \n\n', style: 'subheader' },
      {
        ul: [
          `Agreement number: ${data.reference} \n\n`,
          `Agreement holder: ${data.name} - ${data.sbi} \n\n`,
          `Agreement start date: ${moment(data.startDate).format('D MMMM YYYY')} \n\n`,
          `Agreement end date: ${calculateEndDate(data.startDate, 6)} \n\n`,
          `Type of livestock review: ${data.whichSpecies} \n\n`
        ]
      },
      { text: `You must have a minimum number of animals on the date the vet visits your farm to do the review. You must have ${eligibility(data.whichSpecies)}.\n\n` },
      { text: 'More information\n\n', style: 'subheader' },
      { text: 'For information about what happens during a review and what you need to do, read the ' },
      { text: 'guidance on how to apply for an annual health and welfare review of livestock.\n\n', link: `${applyServiceUri}/guidance-for-farmers`, decoration: 'underline', color: '#1D70B8' },
      { text: 'For information on how to claim, read the ' },
      { text: 'guidance on how to claim funding for an annual health and welfare review of livestock.\n\n', link: `${applyServiceUri}/claim-guidance-for-farmers`, decoration: 'underline', color: '#1D70B8' }
    ]
  }

  return endemics.enabled ? applicationDetailsEndemicsOn : applicationDetailsEndemicsOff
}

module.exports = applicationDetails
