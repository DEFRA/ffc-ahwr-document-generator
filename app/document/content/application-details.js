import moment from 'moment'
import { appConfig } from '../../config'

export const applicationDetails = (data) => {
  return {
    stack: [
      { text: 'You have applied for funding for:', margin: [0, 10, 0, 6] },
      {
        ul: [
          { text: 'animal health and welfare reviews', link: 'https://www.gov.uk/guidance/farmers-how-to-apply-for-funding-to-improve-animal-health-and-welfare#animal-health-and-welfare-review', decoration: 'underline', color: '#1D70B8', margin: [15, 0, 0, 5] },
          { text: 'endemic disease follow-ups', link: 'https://www.gov.uk/guidance/farmers-how-to-apply-for-funding-to-improve-animal-health-and-welfare#endemic-disease-follow-up', decoration: 'underline', color: '#1D70B8', margin: [15, 0, 0, 5] }
        ]
      },
      { text: ['By applying for this funding, you have entered into an agreement with the Rural Payments Agency. The agreement will be governed by the ', { text: 'terms and conditions.', link: appConfig.termsAndConditionsUrl, decoration: 'underline', color: '#1D70B8' }], margin: [0, 20, 0, 10] },
      { text: 'Agreement details', style: 'subheader', margin: [0, 20, 0, 7] },
      {
        table: {
          body: [
            [{ text: 'Agreement number:', margin: [0, 10, 0, 10] }, { text: `${data.reference}`, margin: [0, 10, 0, 10] }],
            [{ text: 'Agreement holder:', margin: [0, 10, 0, 10] }, { text: `${data.name} - ${data.sbi}`, margin: [0, 10, 0, 10] }],
            [{ text: 'Agreement start date:', margin: [0, 10, 0, 10] }, { text: `${moment(data.startDate).format('D MMMM YYYY')}`, margin: [0, 10, 0, 10] }],
            [{ text: 'Review and follow-up deadline:', margin: [0, 10, 0, 10] }, { text: '19 June 2027. You must do all your reviews and follow-ups by this date.', margin: [0, 10, 0, 10] }],
            [{ text: 'Claims deadline:', margin: [0, 10, 0, 10] }, { text: '19 September 2027. You must submit all your claims by this date.', margin: [0, 10, 0, 10] }]
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 0 : 1
          },
          vLineWidth: function (i, node) {
            return 0
          }
        }
      },
      { text: 'Important requirements', style: 'subheader', margin: [0, 20, 0, 7] },
      { text: 'You must:', margin: [0, 0, 0, 6] },
      {
        ul: [
          { text: 'do all your reviews and follow-ups on the same species', margin: [15, 0, 0, 5] },
          { text: ['have the ', { text: 'minimum number of the livestock', link: 'https://www.gov.uk/guidance/farmers-how-to-apply-for-funding-to-improve-animal-health-and-welfare#who-can-get-funding', decoration: 'underline', color: '#1D70B8' }, ' each time you do a review or follow-up'], margin: [15, 0, 0, 5] },
          { text: ['follow the rules for ', { text: 'timing of reviews and follow-ups', link: 'https://www.gov.uk/guidance/farmers-how-to-apply-for-funding-to-improve-animal-health-and-welfare#timing-of-reviews-and-follow-ups', decoration: 'underline', color: '#1D70B8' }], margin: [15, 0, 0, 0] }
        ]
      },
      { text: 'Guidance', style: 'subheader', margin: [0, 20, 0, 7] },
      {
        ul: [
          { text: 'Get funding to improve animal health and welfare', link: 'https://www.gov.uk/government/collections/funding-to-improve-animal-health-and-welfare-guidance-for-farmers-and-vets', decoration: 'underline', color: '#1D70B8', margin: [15, 0, 0, 0] }
        ]
      }
    ]
  }
}
