import HttpApiAdapter from './HttpApiAdapter'

const adapters = {}

const getHttpApiAdapter = ({
  apiName,
  ...other
} = {}) => {
  const adapter = adapters[apiName]

  if (adapter) return adapter

  adapters[apiName] = new HttpApiAdapter({
    apiName,
    ...other,
  })

  return adapters[apiName]
}

export default getHttpApiAdapter

export { RESPONSE_FORMATS } from './constants'
