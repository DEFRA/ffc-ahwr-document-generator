import { config } from 'dotenv'

config()

process.env.APPLY_SERVICE_URI = 'http://localhost'
process.env.CLAIM_SERVICE_URI = 'http://localhost'
process.env.CARBON_COPY_EMAIL_ADDRESS = 'cc@address.com'
