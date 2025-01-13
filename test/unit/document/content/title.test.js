import { title } from '../../../../app/document/content/title'

jest.mock('../../../../app/config', () => ({
  appConfig: {
    ...jest.requireActual('../../../../app/config').appConfig,
    applyServiceUri: 'test-uri'
  }
}))

describe('title', () => {
  test('it builds an object to use in the page content', () => {
    expect(title()).toEqual({
      stack: [
        {
          fit: [567, 70.875],
          image:
            '/home/node/app/document/images/logo.jpg',
          link: 'test-uri',
          style: 'logo'
        },
        {
          alignment: 'left',
          style: 'header',
          text: 'Agreement summary: get funding to improve animal health and welfare'
        }
      ]
    })
  })
})
