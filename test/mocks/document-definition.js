const path = require('path')
const imagePath = path.join(__dirname, '../../app/document/images')

module.exports = {
  pageSize: 'A4',
  content: [
    {
      stack: [
        {
          image: `${imagePath}/logo.jpg`,
          fit: [
            567,
            70.875
          ],
          style: 'logo',
          link: 'http://localhost:3000/apply'
        },
        {
          text: 'Annual health and welfare review of livestock agreement summary',
          style: 'header',
          alignment: 'left'
        }
      ]
    },
    {
      stack: [
        {
          text: 'You have applied for funding for a review.\n\n'
        },
        {
          text: 'By applying for this funding you’ve entered into an agreement with the Rural Payments Agency (RPA). The agreement will be governed by the agreed terms and conditions.\n\n'
        },
        {
          text: 'Agreement summary \n\n',
          style: 'subheader'
        },
        {
          text: 'Here are the following details:\n\n'
        },
        {
          ul: [
            'Agreement number: AHWR-1234-5678 \n\n',
            'Agreement holder: John Farmer - 111111111 \n\n',
            'Agreement start date: 22/03/2023 \n\n',
            'Agreement end date: 22/09/2023 \n\n',
            'Type of livestock review: beef \n\n'
          ]
        },
        {
          text: 'You must have a minimum number of animals on the date the vet visits your farm to do the review. You must have 11 or more beef cattle.\n\n'
        },
        {
          text: 'Terms and conditions\n\n',
          link: '#',
          decoration: 'underline',
          color: '#1D70B8'
        }
      ]
    }
  ],
  footer: {
    stack: [
      {
        text: 'Date Generated: 22/03/2023    Application Reference: AHWR-1234-5678    Application Status: Agreement Offered',
        style: 'footer'
      }
    ]
  },
  styles: {
    default: {
      font: 'Arial',
      fontSize: 14,
      lineHeight: 1.15
    },
    header: {
      fontSize: 24,
      bold: true,
      margin: [
        0,
        10,
        0,
        10
      ]
    },
    subheader: {
      fontSize: 18
    },
    logo: {
      margin: [
        0,
        0,
        0,
        14.175
      ]
    },
    style: {
      margin: [
        0,
        0,
        0,
        5
      ]
    },
    footer: {
      alignment: 'center',
      fontSize: 8
    }
  },
  defaultStyle: {
    font: 'Arial',
    fontSize: 14,
    lineHeight: 1.15
  }
}
