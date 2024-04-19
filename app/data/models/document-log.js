const { DOCUMENT_CREATED } = require('../../statuses')

module.exports = (sequelize, DataTypes) => {
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
    status: { type: DataTypes.STRING, defaultValue: DOCUMENT_CREATED },
    createdAt: { type: DataTypes.DATE, defaultValue: Date.now() },
    updatedAt: { type: DataTypes.DATE, defaultValue: null }
  }, {
    freezeTableName: true,
    tableName: 'document_log'
  })
  return documentLog
}
