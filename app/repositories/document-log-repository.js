import { REDACT_PII_VALUES } from 'ffc-ahwr-common-library'
import { buildData } from '../data/index.js'
import { Sequelize, Op } from 'sequelize'

const { models } = buildData

export const set = async (data, fileName) => {
  const { reference, sbi } = data
  return models.documentLog.create({ reference, sbi, data, fileName })
}

export const update = async (reference, data) => {
  return models.documentLog.update(data,
    { where: { reference } })
}

export const redactPII = async (agreementReference, redactedSbi, logger) => {
  const redactedValueByField = {
    name: REDACT_PII_VALUES.REDACTED_NAME,
    email: REDACT_PII_VALUES.REDACTED_EMAIL,
    orgEmail: REDACT_PII_VALUES.REDACTED_ORG_EMAIL,
    farmerName: REDACT_PII_VALUES.REDACTED_FARMER_NAME,
    sbi: redactedSbi
  }

  let totalUpdates = 0

  for (const [field, redactedValue] of Object.entries(redactedValueByField)) {
    const [affectedCount] = await models.documentLog.update(
      {
        sbi: redactedSbi,
        filename: REDACT_PII_VALUES.REDACTED_FILENAME,
        data: Sequelize.fn(
          'jsonb_set',
          Sequelize.col('data'),
          Sequelize.literal(`'{${field}}'`),
          Sequelize.literal(`'"${redactedValue}"'`)
        )
      },
      {
        where: {
          reference: agreementReference,
          [Op.and]: Sequelize.literal(`data->>'${field}' IS NOT NULL`)
        }
      }
    )

    totalUpdates += affectedCount
  }

  if (totalUpdates > 0) {
    logger.info(`Total redacted fields across messages: ${totalUpdates} for agreementReference: ${agreementReference}`)
  } else {
    logger.info(`No messages updated for agreementReference: ${agreementReference}`)
  }
}
