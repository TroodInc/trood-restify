import { types } from 'mobx-state-tree'

import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import set from 'lodash/set'


const hasErrors = errors => {
  if (errors === undefined || errors === null) return false
  if (typeof errors === 'object') {
    return Object.keys(errors).reduce((memo, key) => {
      const error = errors[key]
      if (error === undefined || error === null) return memo || false
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
    if (typeof nextValue === 'object' && nextValue !== null) {
      let oldValue = get(data, key)
      if (typeof oldValue !== 'object' || oldValue === null) {
        oldValue = Array.isArray(nextValue) ? [] : {}
      }
      set(data, key, changeData(oldValue, nextValue))
    } else {
      set(data, key, nextValue)
    }
  })
  return data
}

export const emptyForm = {
  data: {},
  errors: {},
  hasErrors: false,
}

export default types.model(`form`, {
  name: types.identifier,
  data: types.optional(types.frozen(), {}),
  errors: types.optional(types.frozen(), {}),
})
  .views(self => ({
    get hasErrors() {
      return hasErrors(self.errors)
    }
  }))
  .actions(self => ({
    changeFields(values) {
      self.data = changeData(self.data, values)
    },
    changeFieldsErrors(errors) {
      self.errors = changeData(self.errors, errors)
    },
  }))
