import { types, getSnapshot, isArrayType } from 'mobx-state-tree'

import modelItem from './modelItem'


const getJsonCopyByPk = (items, pk) => {
  const item = items.get(pk)
  if (!item) return {}
  return { ...getSnapshot(item) }
}

const getReferences = type => {
  if (!type) return undefined
  const matches = Array.from((type.name || '').matchAll(/lateRef\(([\w:]*)\)/g))
    .map(match => match[1])
  if (matches.length) return matches
  return undefined
}

const modelList = (
  {
    apiAdapter,
    modelName,
    modelPk,
    modelEndpoint,
    modelFields,
  },
  getStore,
  getItemModel,
  setItemModel,
) => {
  const Item = modelItem(apiAdapter.apiName, modelName, modelPk, modelFields, getStore, getItemModel)
  setItemModel(apiAdapter.apiName, modelName, Item)

  const ItemPage = types.model(`${modelName}_page`, {
    page: types.identifierNumber,
    items: types.map(types.reference(Item)),
    $loading: false,
    $error: 0,
    $errorData: types.maybeNull(types.frozen()),
  })

  const ItemPages = types.model(`${modelName}_pages`, {
    pageSize: types.identifierNumber,
    pages: types.map(ItemPage),
  })

  const ItemMap = types.model(`${modelName}_map`, {
    url: types.identifier,
    count: types.number,
    pageSizes: types.map(ItemPages),
  })

  return types.model(`${modelName}_list`, {
    modelName: types.identifier,
    items: types.map(Item)
      .hooks(self => ({
        getWithProxy(key, store) {
          const item = self.get(key)
          const modelStore = store[apiAdapter.apiName][Item.name]
          return new Proxy(item, {
            get(target, prop) {
              const value = target[prop]
              const propType = Item.properties[prop]
              if (!propType) return value
              if (
                Object.prototype.hasOwnProperty.call(target, prop) &&
                (value === null || value === undefined) &&
                !target.$loading &&
                !target.$loadedById &&
                !target.$error
              ) {
                modelStore.getByPk(target.pk)
              }
              return value
            },
          })
        },
      })),
    lists: types.map(ItemMap),
  })
    .views(self => ({
      asyncGetByPk(pk, options = {}, includeDeleted = false) {
        const normalPk = modelFields[modelPk] === 'number' ? +pk : pk.toString()
        const item = self.items.get(normalPk) || {}
        if (item.$error) {
          return Promise.resolve(() => self.items.getWithProxy(normalPk, getStore()) || {})
        }
        self.createItem(normalPk)
        return apiAdapter.GET(modelEndpoint, { ...options, pk: normalPk }, () => {
          self.setItemLoading(normalPk, true)
        })
          .then(({ status, data }) => {
            if (status) {
              self.createItem({
                ...data,
                $loading: false,
                $loadedById: !options.filters || item.$loadedById,
                $error: 0,
                $errorData: null,
              })
            }
            const result = self.items.getWithProxy(normalPk, getStore()) || {}
            if (!includeDeleted && result.$deleted) return {}
            return result
          })
          .catch(({ status, error }) => {
            self.setItemError(normalPk, status, error)
          })
      },
      getByPk(pk, options = {}, includeDeleted = false) {
        self.asyncGetByPk(pk, options)
        const result = self.items.getWithProxy(pk, getStore()) || {}
        if (!includeDeleted && result.$deleted) return {}
        return result
      },
      asyncGetPage(page = 0, pageSize = 0, options = {}, includeDeleted = false) {
        const url = apiAdapter.getUrl(modelEndpoint, options)
        self.createList(url, page, pageSize)
        return apiAdapter.GET(
          modelEndpoint,
          { ...options, page, pageSize },
          () => self.setListLoading(url, page, pageSize, true),
        )
          .then(resp => {
            if (resp.status) {
              self.setListLoading(url, page, pageSize, false)
              self.createList(url, page, pageSize, resp)
            }
            const listItem = self.lists.get(url)
            if (listItem) {
              const pageSizeItem = listItem.pageSizes.get(pageSize)
              if (pageSizeItem) {
                const pageItem = pageSizeItem.pages.get(page)
                if (pageItem) {
                  return Array.from(pageItem.items.values())
                    .filter(item => includeDeleted || !item.$deleted)
                }
              }
            }
            return []
          })
          .catch(resp => {
            self.setListLoading(url, page, pageSize, false)
            self.createList(url, page, pageSize, resp)
          })
      },
      getPage(page = 0, pageSize = 0, options = {}, includeDeleted = false) {
        const url = apiAdapter.getUrl(modelEndpoint, options)
        self.asyncGetPage(page, pageSize, options)
        const listItem = self.lists.get(url)
        if (listItem) {
          const pageSizeItem = listItem.pageSizes.get(pageSize)
          if (pageSizeItem) {
            const pageItem = pageSizeItem.pages.get(page)
            if (pageItem) {
              return Array.from(pageItem.items.values())
                .filter(item => includeDeleted || !item.$deleted)
            }
          }
        }
        return []
      },
      getPageLoading(page = 0, pageSize = 0, options = {}) {
        const url = apiAdapter.getUrl(modelEndpoint, options)
        const listItem = self.lists.get(url)
        if (listItem) {
          const pageSizeItem = listItem.pageSizes.get(pageSize)
          if (pageSizeItem) {
            const pageItem = pageSizeItem.pages.get(page)
            if (pageItem) {
              return pageItem.$loading
            }
          }
        }
        return false
      },
      getInfinityPages(pageSize = 0, options = {}, includeDeleted = false) {
        let page = 0
        const url = apiAdapter.getUrl(modelEndpoint, options)
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
        return items.filter(item => includeDeleted || !item.$deleted)
      },
      getInfinityPagesLoading(pageSize = 0, options = {}) {
        let loading = false
        const url = apiAdapter.getUrl(modelEndpoint, options)
        if (self.lists.has(url) && self.lists.get(url).pageSizes.has(pageSize)) {
          let page = 0
          let pageItem = self.lists.get(url).pageSizes.get(pageSize).pages.get(page)
          while (!loading && pageItem) {
            loading = loading || pageItem.$loading
            page += 1
            pageItem = self.lists.get(url).pageSizes.get(pageSize).pages.get(page)
          }
        }
        return loading
      },
      getInfinityNextPageNumber(pageSize = 0, options = {}) {
        let page = 0
        const url = apiAdapter.getUrl(modelEndpoint, options)
        if (self.lists.has(url)) {
          const { count, pageSizes } = self.lists.get(url)
          if (pageSizes.has(pageSize)) {
            const { pages } = pageSizes.get(pageSize)
            while (pages.has(page)) {
              page += 1
            }
            if (page * pageSize > count) return undefined
            return page
          }
        }
        return  0
      },
      getInfinityNextPage(pageSize = 0, options = {}) {
        const page = self.getInfinityNextPageNumber(pageSize, options)
        if (page !== undefined) {
          self.asyncGetPage(page, pageSize, options)
        }
      },
      getPagesCount(pageSize = 0, options = {}) {
        const url = apiAdapter.getUrl(modelEndpoint, options)
        const listItem = self.lists.get(url)
        if (listItem) {
          return Math.ceil(listItem.count / pageSize)
        }
        return 0
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

          Object.keys(data).forEach(key => {
            const keyType = Item.properties[key]
            const references = getReferences(keyType)
            if (references) {
              const store = getStore()
              if (isArrayType(keyType)) {
                if (references.length === 1) {
                  const ref = references[0].split(':')
                  normalizedData[key] = data[key]
                    .map(item => store[ref[0]][ref[1]].createItem(item))
                } else {
                  normalizedData[key] = data[key].map(item => {
                    const genericModel = apiAdapter.getItemGenericType(item)
                    const ref = genericModel.split(':')
                    if (ref.length === 1) {
                      ref.push(ref[0])
                      ref[0] = apiAdapter.apiName
                    }
                    return store[ref[0]][ref[1]].createItem(item)
                  })
                }
              } else {
                if (references.length === 1) {
                  const ref = references[0].split(':')
                  normalizedData[key] = store[ref[0]][ref[1]].createItem(data[key])
                } else {
                  const genericModel = apiAdapter.getItemGenericType(data[key])
                  const ref = genericModel.split(':')
                  if (ref.length === 1) {
                    ref.push(ref[0])
                    ref[0] = apiAdapter.apiName
                  }
                  normalizedData[key] = store[ref[0]][ref[1]].createItem(data[key])
                }
              }
            } else {
              normalizedData[key] = data[key]
            }
          })

          self.items.set(pk, normalizedData)
          return self.items.get(pk)
        }

        if (!self.items.has(data)) {
          self.items.set(data, { [pkField]: data })
        }

        return self.items.get(data)
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
          pageData = {
            page,
            items: {},
          }
          pageSizeData = {
            pageSize,
            pages: { [page]: pageData },
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
      setListLoading(url, page = 0, pageSize = 0, loading) {
        const listItem = self.lists.get(url)
        if (listItem) {
          const pageSizeItem = listItem.pageSizes.get(pageSize)
          if (pageSizeItem) {
            const pageItem = pageSizeItem.pages.get(page)
            if (pageItem) {
              pageItem.$loading = loading
            }
          }
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
          ...self.items.get(pk),
          [pkField]: pk,
          $loading: false,
          $error: error,
          $errorData: errorData,
        })
      },
      setItemDeleted(pk) {
        if (self.items.has(pk)) {
          self.items.set(pk, {
            ...self.items.get(pk),
            $deleted: true,
          })
        }
      },
      upsert(pk, body, options = {}) {
        let method = (options.method || '').toUpperCase()
        if (!method) {
          method = pk ? 'PATCH' : 'POST'
        }
        return apiAdapter[method](options.endpoint || modelEndpoint, { ...options, pk, body })
          .then(resp => {
            const { status, data } = resp
            if (status) {
              self.createItem({
                ...data,
                $loading: false,
                $error: 0,
                $errorData: null,
              })
            }
            return resp
          })
          .catch(resp => {
            const { status, error } = resp
            if (pk) self.setItemError(pk, status, error)
            return Promise.reject(resp)
          })
      },
      deleteByPk(pk, options = {}) {
        apiAdapter.DELETE(modelEndpoint, { ...options, pk })
          .then(() => self.setItemDeleted(pk))
      },
    }))
}

export default modelList
