import appInsights from 'applicationinsights'

export const setup = (logger) => {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights.setup().start()
    logger.info('App Insights Running')
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    appInsights.defaultClient.context.tags[cloudRoleTag] = process.env.APPINSIGHTS_CLOUDROLE ?? ''
  } else {
    logger.info('App Insights Not Running!')
  }
}
