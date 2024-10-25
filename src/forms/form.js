import { types, getParent } from 'mobx-state-tree'

import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import set from 'lodash/set'


const hasErrors = errors => {
  if (errors === undefined || errors === null) return false
  if (typeof errors === 'object') {
    return Object.keys(errors).reduce((memo, key) => {
      const error = errors[key]
      if (error === undefined || error === null || error === false) return memo || false
      if (typeof error === 'object') return memo || hasErrors(error)
      return true
    }, false)
  }
  return true
}

const changeData = (oldData, nextData) => {
  const data = cloneDeep(oldData)
  Object.keys(nextData).forEach(key => {
    const nextValue = get(nextData, key)
    if (typeof nextValue === 'object' && !Array.isArray(nextValue) && nextValue !== null) {
      let oldValue = get(data, key)
      if (typeof oldValue !== 'object' || oldValue === null) {
        oldValue = {}
      }
      set(data, key, changeData(oldValue, nextValue))
    } else {
      set(data, key, nextValue)
    }
  })
  return data
}

const MainForm = types.model('form', {
  name: types.identifier,
  $apiName: 'default',
  $modelName: 'default',
  $pk: types.union(types.number, types.string, types.null, types.undefined),
  data: types.optional(types.frozen(), {}),
  errors: types.optional(types.frozen(), {}),
})
  .views(self => ({
    get hasErrors() {
      return hasErrors(self.errors)
    },
  }))
  .actions(self => ({
    changeFields(values) {
      self.data = changeData(self.data, values)
    },
    changeFieldsErrors(errors) {
      self.errors = changeData(self.errors, errors)
    },
    clearForm() {
      self.errors = {}
      self.data = {}
    },
    remove() {
      getParent(self, 2).removeItem(self)
    },
  }))

const formsModels = {}

const form = (apiName = 'default', modelName = 'default', formName, apisStore) => {
  let formModel = get(formsModels, [apiName, modelName, formName])
  if (formModel) return formModel

  const modelStore = apisStore[apiName][modelName]
  formModel = MainForm.extend(self => ({
    actions: {
      submit(options, remove = false, transform = v => v) {
        return modelStore.upsert(self.$pk, JSON.stringify(transform(self.data)), options)
          .then(res => {
            if (remove) self.remove()
            return res
          })
      },
    },
  }))

  set(formsModels, [apiName, modelName, formName], formModel)

  return formModel
}

export default form
