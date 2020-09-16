import HttpApiAdapter from './HttpApiAdapter'

const adapters = {}

const getHttpApiAdapter = ({
  apiName,
  apiHost,
  ...other
} = {}) => {
  const apiId = apiName || apiHost
  const adapter = adapters[apiId]

  if (adapter) return adapter

  adapters[apiId] = new HttpApiAdapter({
    apiHost,
    ...other,
  })

  return adapters[apiId]
}

export default getHttpApiAdapter

export { RESPONSE_FORMATS } from './constants'
