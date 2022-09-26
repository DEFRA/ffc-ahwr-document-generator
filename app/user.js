const { downloadBlob } = require('./storage')
const { usersFile, usersContainer } = require('./config').storageConfig

const getUsers = async () => {
  const contents = await downloadBlob(usersContainer, usersFile) ?? '[]'
  return JSON.parse(contents)
}

const getByEmail = async (email) => {
  return (await getUsers()).find(x => x.email.toLowerCase() === email.toLowerCase())
}

const getBySbi = async (sbi) => {
  return (await getUsers()).find(x => x.sbi.toLowerCase() === sbi.toLowerCase())
}

module.exports = {
  getByEmail,
  getBySbi
}
