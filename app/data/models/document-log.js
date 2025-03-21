import { DOCUMENT_STATUSES } from '../../constants.js'

export const buildDocumentLog = (sequelize, DataTypes) => {
  const documentLog = sequelize.define('documentLog', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: sequelize.UUIDV4
    },
    reference: DataTypes.STRING,
    emailReference: DataTypes.STRING,
    sbi: DataTypes.STRING,
    data: DataTypes.JSONB,
    fileName: DataTypes.STRING,
    completed: DataTypes.DATE,
    status: { type: DataTypes.STRING, defaultValue: DOCUMENT_STATUSES.DOCUMENT_CREATED },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  }, {
    freezeTableName: true,
    tableName: 'document_log'
  })

  return documentLog
}
