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

export const redactPII = async (applicationReference) => {
  // TODO 1067 move to shared lib
  const REDACT_PII_VALUES = {
    REDACTED_NAME: 'REDACTED_NAME',
    REDACTED_EMAIL: 'redacted.email@example.com',
    REDACTED_ORG_EMAIL: 'redacted.org.email@example.com',
    REDACTED_FARMER_NAME: 'REDACTED_FARMER_NAME'
  }

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

  // eslint-disable-next-line no-unused-vars
  // const [_, updates] = await models.application.update(
  await models.documentLog.update(
    { data },
    {
      where: { reference: applicationReference },
      returning: true
    }
  )

  // TODO 1067 add later
  // const [updatedRecord] = updates
  // const { updatedAt, data: { organisation: { sbi } } } = updatedRecord.dataValues

  // const eventData = {
  //   applicationReference: reference,
  //   reference,
  //   updatedProperty,
  //   newValue,
  //   oldValue,
  //   note
  // }
  // const type = `application-${updatedProperty}`
  // await claimDataUpdateEvent(eventData, type, user, updatedAt, sbi)

  // await buildData.models.claim_update_history.create({
  //   applicationReference: reference,
  //   reference,
  //   note,
  //   updatedProperty,
  //   newValue,
  //   oldValue,
  //   eventType: type,
  //   createdBy: user
  // })
}
