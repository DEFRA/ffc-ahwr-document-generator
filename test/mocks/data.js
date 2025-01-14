export const mockDocumentRequest = {
  reference: 'AHWR-1234-5678',
  sbi: '123456789',
  whichSpecies: 'beef',
  startDate: new Date(),
  userType: 'newUser',
  email: 'test@email.com',
  farmerName: 'Farmer'
}

export const mockUser = {
  farmerName: 'John Farmer',
  name: 'The Dairy Ltd',
  sbi: '111111111',
  cph: '11/111/1111',
  address: '1 Long Lane, Longton, AA11 1AA',
  email: 'admin@the-dairy.com',
  orgEmail: 'test@email.org'
}

export const mockRequest = {
  ...mockDocumentRequest,
  ...mockUser
}
