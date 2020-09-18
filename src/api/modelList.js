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
    $loading: false,
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
    items: types.map(Item)
      .hooks(self => ({
        getWithProxy(key, store) {
          const item = self.get(key)
          const modelStore = store[Item.name]
          return new Proxy(item, {
            get(target, prop) {
              const value = target[prop]
              const type = target.getFieldType(prop)
              if (
                Object.prototype.hasOwnProperty.call(target, prop) &&
                (value === null || value === undefined || (
                  type.isArray && !value.length
                ))
              ) {
                if (!target.$loading && !target.$loadedById) {
                  modelStore.getByPk(target.pk)
                }
                if (type.isArray) return []
              }
              return target[prop]
            },
          })
        },
      })),
    lists: types.map(ItemMap),
  })
    .views(self => ({
      asyncGetByPk(pk, options = {}) {
        self.createItem(pk)
        return apiAdapter.callGet(apiModelEndpoint, { ...options, pk }, () => {
          self.setItemLoading(pk, true)
        })
          .then(({ status, error, data }) => {
            if (status) {
              if (error) {
                self.setItemError(pk, status, error)
              } else {
                self.createItem({
                  ...data,
                  $loading: false,
                  $loadedById: !options.filters,
                  $error: 0,
                  $errorData: null,
                })
              }
            }
            return self.items.getWithProxy(pk, getStore()) || {}
          })
      },
      getByPk(pk, options = {}) {
        self.asyncGetByPk(pk, options)
        return self.items.getWithProxy(pk, getStore()) || {}
      },
      asyncGetPage(page = 0, pageSize = 0, options = {}) {
        const url = apiAdapter.getUrl(apiModelEndpoint, options)
        self.createList(url, page, pageSize)
        return apiAdapter.callGet(apiModelEndpoint, { ...options, page, pageSize })
          .then(resp => {
            if (resp.status) {
              self.createList(url, page, pageSize, resp)
            }
            const pageItem = self.lists.get(url).pageSizes.get(pageSize).pages.get(page)
            if (!pageItem) return []
            return Array.from(pageItem.items.values())
          })
      },
      getPage(page = 0, pageSize = 0, options = {}) {
        const url = apiAdapter.getUrl(apiModelEndpoint, options)
        self.asyncGetPage(page, pageSize, options)
        const pageItem = self.lists.get(url).pageSizes.get(pageSize).pages.get(page)
        if (!pageItem) return []
        return Array.from(pageItem.items.values())
      },
      getInfinityPages(pageSize = 0, options = {}) {
        let page = 0
        const url = apiAdapter.getUrl(apiModelEndpoint, options)
        if (
          !(self.lists.has(url) &&
          self.lists.get(url).pageSizes.has(pageSize) &&
          self.lists.get(url).pageSizes.get(pageSize).pages.has(page))
        ) {
          self.asyncGetPage(page, pageSize, options)
        }
        let pageItem = self.lists.get(url).pageSizes.get(pageSize).pages.get(page)
        let items = []
        while (pageItem) {
          items = [...items, ...Array.from(pageItem.items.values())]
          page += 1
          pageItem = self.lists.get(url).pageSizes.get(pageSize).pages.get(page)
        }
        return items
      },
      getInfinityNextPageNumber(pageSize = 0, options = {}) {
        let page = 0
        const url = apiAdapter.getUrl(apiModelEndpoint, options)
        const { count, pageSizes } = self.lists.get(url)
        const { pages } = pageSizes.get(pageSize)
        while (pages.has(page)) {
          page += 1
        }
        if (page * pageSize > count) return undefined
        return page
      },
      getInfinityNextPage(pageSize = 0, options = {}) {
        const page = self.getInfinityNextPageNumber(pageSize, options)
        if (page !== undefined) {
          self.asyncGetPage(page, pageSize, options)
        }
      },
    }))
    .actions(self => ({
      createItem(data) {
        const pkField = Item.identifierAttribute

        if (typeof data === 'object') {
          const pk = data[pkField]
          const normalizedData = getJsonCopyByPk(self.items, pk)
          const simpleData = { [pkField]: pk }

          if (!self.items.has(pk)) self.items.set(pk, simpleData) // pre create item for reference

          const newItem = self.items.getWithProxy(pk, getStore())
          Object.keys(data).forEach(key => {
            const keyType = newItem.getFieldType(key)
            if (keyType.isSimple) {
              normalizedData[key] = data[key]
            } else if (keyType.isReference) {
              const store = getStore()
              // create reference objects
              if (keyType.isArray) {
                normalizedData[key] = data[key].map(item => store[keyType.type.name].createItem(item))
              } else {
                normalizedData[key] = store[keyType.type.name].createItem(data[key])
              }
            }
          })

          self.items.set(pk, normalizedData)
          return pk
        }

        if (!self.items.has(data)) {
          self.items.set(data, { [pkField]: data })
        }

        return data
      },
      createList(
        url,
        page = 0,
        pageSize = 0,
        responseData,
      ) {
        let pageData
        let pageSizeData
        let listData
        if (!responseData) {
          pageSizeData = {
            pageSize,
          }
          listData = {
            url,
            count: 0,
            pageSizes: {
              [pageSize]: pageSizeData,
            },
          }
        } else {
          const {
            data = [],
            count = 0,
            status,
            error: errorData,
          } = responseData
          const items = data.reduce((memo, item) => {
            const key = self.createItem({ ...item, $error: 0, $errorData: undefined })
            return {
              ...memo,
              [key]: key,
            }
          }, {})

          pageData = {
            page,
            items,
            $error: errorData ? status : 0,
            $errorData: errorData,
          }
          pageSizeData = {
            pageSize,
            pages: { [page]: pageData },
          }
          listData = {
            url,
            count,
            pageSizes: {
              [pageSize]: pageSizeData,
            },
          }
        }

        const listItem = self.lists.get(url)
        if (listItem) {
          const pageSizeItem = listItem.pageSizes.get(pageSize)
          if (pageSizeItem) {
            const pageItem = pageSizeItem.pages.get(page)
            if (pageItem && responseData) {
              pageSizeItem.pages.set(page, pageData)
            } else if (!pageItem && pageData) {
              pageSizeItem.pages.set(page, pageData)
            }
          } else {
            listItem.pageSizes.set(pageSize, pageSizeData)
          }
        } else {
          self.lists.set(url, listData)
        }
        if (listData.count) {
          listItem.count = listData.count
        }
      },
      setItemLoading(pk, loading) {
        if (self.items.has(pk)) {
          self.items.get(pk).$loading = loading
        }
      },
      setItemError(pk, error, errorData) {
        const pkField = Item.identifierAttribute
        self.items.set(pk, {
          [pkField]: pk,
          $loading: false,
          $error: error,
          $errorData: errorData,
        })
      },
    }))
}
