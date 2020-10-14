import { types, destroy } from 'mobx-state-tree'

import getForm, { emptyForm } from './form'


const getForms = (apisStore) => types.model(`forms`, {
  forms: types.map(types.union({
    dispatcher: snapshot => {
      return getForm(snapshot.$apiName, snapshot.$modelName, apisStore)
    },
  })),
})
  .views(self => ({
    getFormName({
      formName,
      apiName,
      modelName,
      modelPk,
    } = {}) {
      if (formName) return formName
      if (apiName && modelName) {
        if (modelPk) {
          return `${apiName}:${modelName}:${modelPk}`
        }
        return `${apiName}:${modelName}`
      }
      throw new Error('You mast set formName or apiName and modelName')
    },
    async asyncGetForm({
      formName,
      apiName,
      modelName,
      modelPk,
      values,
    } = {}) {
      const name = self.getFormName({
        formName,
        apiName,
        modelName,
        modelPk,
      })

      let form
      if (self.forms.has(name)) {
        form = self.forms.get(name)
      } else {
        form = await self.createForm({
          formName: name,
          apiName,
          modelName,
          modelPk,
          values,
        })
      }
      return form || emptyForm
    },
    getForm({
      formName,
      apiName,
      modelName,
      modelPk,
      values,
    } = {}) {
      const name = self.getFormName({
        formName,
        apiName,
        modelName,
        modelPk,
      })
      if (!self.forms.has(name)) {
        self.createForm({
          formName: name,
          apiName,
          modelName,
          modelPk,
          values,
        })
      }
      return self.forms.get(name) || emptyForm
    },
  }))
  .actions(self => ({
    createForm({
      formName,
      apiName,
      modelName,
      modelPk,
      values,
    }) {
      return new Promise(resolve => {
        if (apiName && modelName && modelPk) {
          apisStore[apiName][modelName].asyncGetByPk(modelPk)
            .then(model => {
              const data = {
                ...model.modelData,
                ...values,
              }
              self.setForm(formName, {
                name: formName,
                $apiName: apiName,
                $modelName: modelName,
                $pk: modelPk,
                data,
              })
              resolve(self.forms.get(formName))
            })
        } else {
          const data = values
          self.setForm(formName, {
            name: formName,
            $apiName: apiName,
            $modelName: modelName,
            $pk: modelPk,
            data,
          })
          resolve(self.forms.get(formName))
        }
      })
    },
    setForm(formName, data) {
      self.forms.set(formName, data)
    },
    removeItem(item) {
      destroy(item)
    },
  }))

export default (apisStore) => getForms(apisStore).create()
