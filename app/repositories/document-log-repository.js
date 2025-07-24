import { REDACT_PII_VALUES } from 'ffc-ahwr-common-library'
import { buildData } from '../data/index.js'
import { Sequelize } from 'sequelize'

const { models } = buildData

export const set = async (data, fileName) => {
  const { reference, sbi } = data
  return models.documentLog.create({ reference, sbi, data, fileName })
}

export const update = async (reference, data) => {
  return models.documentLog.update(data,
    { where: { reference } })
}

export const redactPII = async (agreementReference, logger) => {
  // TODO adds field that ok? no do seperate update
  const data = Sequelize.fn(
    'jsonb_set',
    Sequelize.fn(
      'jsonb_set',
      Sequelize.fn(
        'jsonb_set',
        Sequelize.fn(
          'jsonb_set',
          Sequelize.col('data'),
          Sequelize.literal('\'{name}\''),
          Sequelize.literal(`'"${REDACT_PII_VALUES.REDACTED_NAME}"'`)
        ),
        Sequelize.literal('\'{email}\''),
        Sequelize.literal(`'"${REDACT_PII_VALUES.REDACTED_EMAIL}"'`)
      ),
      Sequelize.literal('\'{orgEmail}\''),
      Sequelize.literal(`'"${REDACT_PII_VALUES.REDACTED_ORG_EMAIL}"'`)
    ),
    Sequelize.literal('\'{farmerName}\''),
    Sequelize.literal(`'"${REDACT_PII_VALUES.REDACTED_FARMER_NAME}"'`)
  )

  const [, updatedRows] = await models.documentLog.update(
    { data },
    {
      where: { reference: agreementReference },
      returning: true
    }
  )

  if (updatedRows.length > 0) {
    logger.info(`Redacted PII in ${updatedRows.length} message(s) for agreementReference: ${agreementReference}`)
  } else {
    logger.info(`No messages updated for agreementReference: ${agreementReference}`)
  }
}
