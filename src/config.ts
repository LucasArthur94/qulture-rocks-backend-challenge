// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('../.env.json')

const getEnv = (key: string) =>
  process.env[key] ||
  (env[process.env.NODE_ENV!] && env[process.env.NODE_ENV!][key])

export const config = {
  port: parseInt(getEnv('PORT')) || 3000,
  postgres: {
    url: getEnv('DATABASE_URL'),
  },
}
