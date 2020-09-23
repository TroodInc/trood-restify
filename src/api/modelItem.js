import { types } from 'mobx-state-tree'


const fkRegex = /fk\((.*)\)/
const fkArrayRegex = /fk_array\((.*)\)/

const getFkType = (modelName, getStore, getItemModel) => {
  return types.late(`lateRef:${modelName}`, () => types.reference(
    getItemModel(modelName),
    {
      get(pk) {
        const store = getStore()
        return store[modelName].items.getWithProxy(pk, getStore())
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
    return match.includes(':') ? match.trim().replace(':', '_') : `${apiName}_${match.trim()}`
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
      ...fkModelNames.map(modelName => getFkType(modelName, getStore, getItemModel))
    )
  }

  const fkArrayModelNames = getFkModelNamesFromType(fieldType, fkArrayRegex, apiName)
  if (fkArrayModelNames) {
    return types.optional(types.array(types.union(
      types.null,
      types.undefined,
      ...fkArrayModelNames.map(modelName => getFkType(modelName, getStore, getItemModel))
    )), [])
  }

  return types.maybeNull(types.frozen())
}

export default (apiName, apiModelName, apiModelPk, apiModelFields, getStore, getItemModel) => {
  const fields = Object.keys(apiModelFields).reduce((memo, field) => {
    const fieldType = apiModelFields[field]
    return {
      ...memo,
      [field]: parseFieldType(apiName, fieldType, field === apiModelPk, getStore, getItemModel),
    }
  }, {
    $modelName: apiModelName,
    $loading: false,
    $loadedById: false,
    $error: 0,
    $errorData: types.maybeNull(types.frozen()),
  })
  return types.model(apiModelName, fields)
    .views(self => ({
      get pk() {
        return self[apiModelPk]
      },
    }))
}
