import path from 'path'

const imagePath = path.join(__dirname, '../../app/document/images')

export const mockDocumentDefinition = {
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
          text: 'By applying for this funding you have entered into an agreement with the Rural Payments Agency (RPA). The agreement will be governed by the agreed '
        },
        {
          text: 'terms and conditions.\n\n',
          link: '#',
          decoration: 'underline',
          color: '#1D70B8'
        },
        {
          text: 'Agreement summary \n\n',
          style: 'subheader'
        },
        {
          ul: [
            'Agreement number: AHWR-1234-5678 \n\n',
            'Agreement holder: John Farmer - 111111111 \n\n',
            'Agreement start date: 22 March 2023 \n\n',
            'Agreement end date: 22 September 2023 \n\n',
            'Type of livestock review: beef \n\n'
          ]
        },
        {
          text: 'You must have a minimum number of animals on the date the vet visits your farm to do the review. You must have 11 or more beef cattle.\n\n'
        },
        {
          text: 'More information \n\n',
          style: 'subheader'
        },
        {
          text: 'For information about what happens during a review and what you need to to, read the '
        },
        {
          text: 'guidance on how to apply for an annual health and welfare review of livestock. \n\n',
          link: '#',
          decoration: 'underline',
          color: '#1D70B8'
        },
        {
          text: 'For information on how to claim, read the '
        },
        {
          text: 'guidance on how to claim funding for an annual health and welfare review of livestock. \n\n',
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
