import getHttpApiAdapter from '../ApiAdapter'

import ModelList from './modelList'


const registeredItemModels = {}
let store = {}

const getStore = () => store
const getItemModel = modelName => registeredItemModels[modelName]
const setItemModel = (modelName, model) => {
  registeredItemModels[modelName] = model
}

export default (meta = {}, getToken) => {
  Object.keys(meta).forEach(apiName => {
    const apiConfig = meta[apiName]
    const apiAdapter = getHttpApiAdapter({
      ...apiConfig,
      apiName,
      getToken,
    })
    Object.keys(apiConfig.objects).forEach(modelName => {
      const modelConfig = apiConfig.objects[modelName]
      const apiModelName = `${apiName}_${modelName}`
      const apiModelConfig = {
        apiAdapter,
        apiModelName,
        apiModelPk: modelConfig.pk,
        apiModelEndpoint: modelConfig.endpoint,
        apiModelFields: modelConfig.fields,
      }
      const list = ModelList(apiModelConfig, getStore, getItemModel, setItemModel)
      store[apiModelName] = list.create({ apiModelName })
    })
  })

  return store
}
