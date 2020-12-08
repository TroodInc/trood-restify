import { types } from 'mobx-state-tree'


const Item = types.model('default_model', {
  url: types.identifier,
  data: types.maybeNull(types.frozen()),
  $loading: false,
  $error: 0,
  $errorData: types.maybeNull(types.frozen()),
})

export default (apiAdapter) => types.model('default_list', {
  modelName: types.identifier,
  items: types.map(Item),
})
  .views(self => ({
    asyncGetData(endpoint, options = {}) {
      const url = apiAdapter.getUrl(endpoint, options)
      self.createItem(url, { $loading: true })
      return apiAdapter.GET(endpoint, options)
        .then(({ status, error, data }) => {
          if (status) {
            if (error) {
              self.setItemError(url, status, error)
            } else {
              self.createItem(url, { data })
            }
          }
          return (self.items.get(url) || {}).data
        })
    },
    getData(endpoint, options = {}) {
      const url = apiAdapter.getUrl(endpoint, options)
      self.asyncGetData(endpoint, options)
      return (self.items.get(url) || {}).data
    },
  }))
  .actions(self => ({
    createItem(url, data) {
      self.items.set(url, {
        ...self.items.get(url),
        url,
        $loading: false,
        $error: 0,
        $errorData: null,
        ...data,
      })
    },
    setItemError(url, status, error) {
      self.items.set(url, {
        url,
        $loading: false,
        $error: status,
        $errorData: error,
      })
    },
    upsert(pk, body, options = {}) {
      const method = (options.method || '').toUpperCase()
      if (!(options.endpoint && method)) {
        throw new Error('For use default API you mast set options.endpoint and options.method')
      }
      return apiAdapter[method](options.endpoint, { ...options, pk, body })
    },
  }))
