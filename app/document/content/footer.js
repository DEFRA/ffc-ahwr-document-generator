const footer = (reference) => {
  return {
    stack: [
      { text: `Date Generated: ${new Date().toLocaleString().split(', ')[0]}    Application Reference: ${reference}    Application Status: Agreement Offered`, style: 'footer' },
    ]
  }
}
  
module.exports = footer