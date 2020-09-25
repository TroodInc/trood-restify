import { types, getSnapshot } from 'mobx-state-tree'


const fkRegex = /fk\((.*)\)/
const fkArrayRegex = /fk_array\((.*)\)/

const getFkType = (apiName, modelName, getStore, getItemModel) => {
  return types.late(`lateRef(${apiName}:${modelName})`, () => types.reference(
    getItemModel(apiName, modelName),
    {
      get(pk) {
        const store = getStore()
        return store[apiName][modelName].items.getWithProxy(pk, getStore())
      },
      set(value) {
        return value.pk
      },
    }
  ))
}

const getFkModelNamesFromType = (type, regexp, apiName) => {
  if (typeof type !== 'string') return undefined
  const matches = type.match(regexp)
  if (!matches) return undefined
  return matches[1].split(',').map(match => {
    const normalize = (match.includes(':') ? match.trim() : `${apiName}:${match.trim()}`).split(':')
    return {
      apiName: normalize[0],
      modelName: normalize[1],
    }
  })
}

const parseFieldType = (apiName, fieldType = '', pk = false, getStore, getItemModel) => {
  if (pk) {
    if (fieldType === 'number') {
      return types.identifierNumber
    }
    return types.identifier
  }

  if (typeof types[fieldType] === 'object') {
    return types.maybeNull(types[fieldType])
  }

  const fkModelNames = getFkModelNamesFromType(fieldType, fkRegex, apiName)
  if (fkModelNames) {
    return types.union(
      types.null,
      types.undefined,
      ...fkModelNames.map(model => getFkType(model.apiName, model.modelName, getStore, getItemModel))
    )
  }

  const fkArrayModelNames = getFkModelNamesFromType(fieldType, fkArrayRegex, apiName)
  if (fkArrayModelNames) {
    return types.optional(types.array(types.union(
      types.null,
      types.undefined,
      ...fkArrayModelNames.map(model => getFkType(model.apiName, model.modelName, getStore, getItemModel))
    )), [])
  }

  return types.maybeNull(types.frozen())
}

export default (apiName, modelName, modelPk, modelFields, getStore, getItemModel) => {
  const fields = Object.keys(modelFields).reduce((memo, field) => {
    const fieldType = modelFields[field]
    return {
      ...memo,
      [field]: parseFieldType(apiName, fieldType, field === modelPk, getStore, getItemModel),
    }
  }, {
    $modelName: modelName,
    $loading: false,
    $loadedById: false,
    $error: 0,
    $errorData: types.maybeNull(types.frozen()),
  })
  return types.model(modelName, fields)
    .views(self => ({
      get pk() {
        return self[modelPk]
      },
      get modelData() {
        const snapshot = getSnapshot(self)
        return Object.keys(snapshot).reduce((memo, key) => {
          if (/^\$/.test(key)) return memo
          return {
            ...memo,
            [key]: snapshot[key],
          }
        }, {})
      },
    }))
}
