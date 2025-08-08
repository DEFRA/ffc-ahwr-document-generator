import moment from 'moment'

export const footer = (reference, scheme = 'default') => {
  return {
    stack: footerMap.get(scheme)(reference)
  }
}

const generateDefaultFooter = (reference) => {
  return [
    { text: `Date Generated: ${moment(new Date()).format('DD/MM/YYYY')}    Application Reference: ${reference}    Application Status: Agreement Offered`, style: 'footer' }
  ]
}
const footerMap = new Map([
  ['default', generateDefaultFooter],
  ['ahwr', generateDefaultFooter]
])
