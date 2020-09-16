import { types, getSnapshot } from 'mobx-state-tree'

import modelItem from './modelItem'


const getJsonCopyByPk = (items, pk) => {
  const item = items.get(pk)
  if (!item) return {}
  return { ...getSnapshot(item) }
}

export default (
  {
    apiAdapter,
    apiModelName,
    apiModelPk,
    apiModelEndpoint,
    apiModelFields,
  },
  getStore,
  getItemModel,
  setItemModel,
) => {
  const Item = modelItem(apiModelName, apiModelPk, apiModelFields, getStore, getItemModel)
  setItemModel(apiModelName, Item)

  const ItemPage = types.model(`${apiModelName}_page`, {
    page: types.identifierNumber,
    items: types.map(types.reference(Item)),
    $loaded: false,
    $error: 0,
    $errorData: types.maybeNull(types.frozen()),
  })

  const ItemPages = types.model(`${apiModelName}_pages`, {
    pageSize: types.identifierNumber,
    pages: types.map(ItemPage),
  })

  const ItemMap = types.model(`${apiModelName}_map`, {
    url: types.identifier,
    count: types.number,
    pageSizes: types.map(ItemPages),
  })

  return types.model(`${apiModelName}_list`, {
    apiModelName: types.identifier,
    items: types.map(Item),
    lists: types.map(ItemMap),
  })
    .views(self => ({
      getByPk(pk, options = {}) {
        self.createItem(pk)
        apiAdapter.callGet(apiModelEndpoint, { ...options, pk })
          .then(({ status, error, data }) => {
            if (status) {
              if (error) {
                self.setItemError(pk, status, error)
              } else {
                self.createItem({
                  ...data,
                  $loaded: true,
                  $error: 0,
                  $errorData: null,
                })
              }
            }
          })
        return self.items.get(pk) || {}
      },
      getPage(page = 0, pageSize = 0, options = {}) {
        const url = apiAdapter.getUrl(apiModelEndpoint, options)
        self.createList(url, page, pageSize)
        apiAdapter.callGet(apiModelEndpoint, { ...options, page, pageSize })
          .then(resp => self.createList(url, page, pageSize, resp))
        return Array.from(self.lists.get(url).pageSizes.get(pageSize).pages.get(page).items.values())
      },
    }))
    .actions(self => ({
      createItem(data) {
        const pkField = Item.identifierAttribute
        let pk
        let normalizedData

        if (typeof data === 'object') {
          pk = data[pkField]
          normalizedData = getJsonCopyByPk(self.items, pk)
          const simpleData = { [pkField]: pk }

          self.items.set(pk, simpleData) // pre create item for reference

          const newItem = self.items.get(pk)
          Object.keys(data).forEach(key => {
            const keyType = newItem.getFieldType(key)
            if (keyType.isSimple) {
              normalizedData[key] = data[key]
            } else if (keyType.isReference) {
              const store = getStore()
              // create reference objects
              if (keyType.isReferenceArray) {
                normalizedData[key] = data[key].map(item => store[keyType.type.name].createItem(item))
              } else {
                normalizedData[key] = store[keyType.type.name].createItem(data[key])
              }
            }
          })
        } else {
          pk = data
          normalizedData = getJsonCopyByPk(self.items, pk)
          normalizedData[pkField] = pk
        }

        self.items.set(pk, normalizedData)
        return pk
      },
      createList(
        url,
        page = 0,
        pageSize = 0,
        {
          data = [],
          count = 0,
          status,
          error: errorData,
          loaded,
        } = {},
      ) {
        const items = data.reduce((memo, item) => {
          const key = self.createItem({ ...item, $loaded: loaded, $error: 0, $errorData: undefined })
          return {
            ...memo,
            [key]: key,
          }
        }, {})

        self.lists.set(url, {
          url,
          count,
          pageSizes: {
            [pageSize]: {
              pageSize,
              pages: {
                [page]: {
                  page,
                  items,
                  $loaded: loaded,
                  $error: errorData ? status : 0,
                  $errorData: errorData,
                },
              },
            },
          },
        })
      },
      setItemError(pk, error, errorData) {
        const pkField = Item.identifierAttribute
        self.items.set(pk, {
          [pkField]: pk,
          $loaded: true,
          $error: error,
          $errorData: errorData,
        })
      },
    }))
}
