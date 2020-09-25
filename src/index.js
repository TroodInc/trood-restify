import getApisStore from './api'
import getFormsStore from './forms'

export const getStore = (meta = {}, getToken) => {
  const apis = getApisStore(meta, getToken)
  const forms = getFormsStore(apis)
  return {
    apis,
    forms,
  }
}
