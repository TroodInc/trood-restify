import getHttpApiAdapter from '../ApiAdapter'

import ModelList from './modelList'


const registeredItemModels = {}
let store = {}

const getStore = () => store
const getItemModel = (apiName, modelName) => registeredItemModels[apiName][modelName]
const setItemModel = (apiName, modelName, model) => {
  if (!registeredItemModels[apiName]) registeredItemModels[apiName] = {}
  registeredItemModels[apiName][modelName] = model
}

export default (meta = {}, getToken) => {
  Object.keys(meta).forEach(apiName => {
    if (!store[apiName]) store[apiName] = {}
    const apiConfig = meta[apiName]
    const apiAdapter = getHttpApiAdapter({
      ...apiConfig,
      apiName,
      getToken,
    })
    Object.keys(apiConfig.objects).forEach(modelName => {
      const modelConfig = apiConfig.objects[modelName]
      const apiModelConfig = {
        apiAdapter,
        modelName,
        modelPk: modelConfig.pk,
        modelEndpoint: modelConfig.endpoint,
        modelFields: modelConfig.fields,
      }
      const list = ModelList(apiModelConfig, getStore, getItemModel, setItemModel)
      store[apiName][modelName] = list.create({ modelName })
    })
  })

  return store
}
