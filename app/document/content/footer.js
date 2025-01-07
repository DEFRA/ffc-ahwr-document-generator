import moment from 'moment'

export const footer = (reference) => {
  return {
    stack: [
      { text: `Date Generated: ${moment(new Date()).format('DD/MM/YYYY')}    Application Reference: ${reference}    Application Status: Agreement Offered`, style: 'footer' }
    ]
  }
}
