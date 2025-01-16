import { Sequelize, DataTypes } from 'sequelize'
import { dbConfig } from '../config/db.js'
import { buildDocumentLog } from './models/document-log.js'

export const buildData = (() => {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)

  // This needs to be done for each table we define in /models
  const documentLog = buildDocumentLog(sequelize, DataTypes)

  if (documentLog.associate) {
    documentLog.associate(sequelize.models)
  }

  return {
    models: sequelize.models,
    sequelize
  }
})()
