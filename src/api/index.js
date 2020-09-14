import ModelList from './modelList'


const registeredItemModels = {}
let store = {}

const getStore = () => store
const getItemModel = modelName => registeredItemModels[modelName]
const setItemModel = (modelName, model) => {
  registeredItemModels[modelName] = model
}

export default (meta = {}) => {
  Object.keys(meta).forEach(modelName => {
    const list = ModelList(modelName, meta[modelName], getStore, getItemModel, setItemModel)
    store[modelName] = list.create({
      modelName,
      lists: {},
    })
  })

  return store
}
