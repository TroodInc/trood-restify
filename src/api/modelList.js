import { types } from 'mobx-state-tree'

import modelItem from './modelItem'


export default (modelName, modelMeta, getStore, getItemModel, setItemModel) => {
  const Item = modelItem(modelName, modelMeta, getStore, getItemModel)
  setItemModel(modelName, Item)

  const ItemMap = types.model(`${modelName}Map`, {
    mapUuid: types.identifier,
    items: types.map(types.reference(Item)),
  })

  return types.model(`${modelName}List`, {
    modelName: types.identifier,
    items: types.map(Item),
    lists: types.map(ItemMap),
  })
    .views(self => ({
      getByPk(pk) {
        return self.items.get(pk) || {}
      }
    }))
    .actions(self => ({
      createItem(data) {
        const pkField = Item.identifierAttribute
        if (typeof data === 'object') {
          const pk = data[pkField]
          const simpleData = {
            [pkField]: pk,
          }
          self.items.set(pk, simpleData)
          const newItem = self.items.get(pk)
          const normalizedData = {}
          Object.keys(data).forEach(key => {
            const keyType = newItem.getFieldType(key)
            if (keyType.isSimple) {
              normalizedData[key] = data[key]
            } else if (keyType.isReference) {
              const store = getStore()
              if (keyType.isReferenceArray) {
                normalizedData[key] = data[key].map(item => store[keyType.type.name].createItem(item))
              } else {
                normalizedData[key] = store[keyType.type.name].createItem(data[key])
              }
            }
          })
          self.items.set(pk, normalizedData)
          return pk
        }
        self.items.set(data, { [pkField]: data })
        return data
      },
      createList(uuid, data = []) {
        const items = data.reduce((memo, item) => {
          const key = self.createItem(item)
          return {
            ...memo,
            [key]: key,
          }
        }, {})
        self.lists.put({
          mapUuid: uuid,
          items,
        })
      }
    }))
}
