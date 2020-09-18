import { types } from 'mobx-state-tree'


const fkRegex = /fk\((.*)\)/
const fkArrayRegex = /fk_array\((.*)\)/

const getFkType = (modelName, getStore, getItemModel) => {
  return types.late(() => types.reference(
    getItemModel(modelName),
    {
      get(pk) {
        const store = getStore()
        return store[modelName].items.getWithProxy(pk, getStore())
      },
      set(value, parent) {
        console.log(value, parent)
        // TODO this method don't called now. Maybe realization incorrect
        return value
      },
    }
  ))
}

const parseFieldType = (fieldType = '', pk = false, getStore, getItemModel) => {
  if (pk) {
    if (fieldType === 'number') {
      return types.identifierNumber
    }
    return types.identifier
  }

  if (types[fieldType]) {
    return types.maybeNull(types[fieldType])
  }

  const fkMatch = fieldType.match(fkRegex)
  if (fkMatch) {
    const fkModelName = fkMatch[1].replace(':', '_')
    return types.maybeNull(getFkType(fkModelName, getStore, getItemModel))
  }

  const fkArrayMatch = fieldType.match(fkArrayRegex)
  if (fkArrayMatch) {
    const fkModelName = fkArrayMatch[1].replace(':', '_')
    return types.maybeNull(types.array(getFkType(fkModelName, getStore, getItemModel)))
  }

  return types.maybeNull(types.frozen())
}

export default (apiModelName, apiModelPk, apiModelFields, getStore, getItemModel) => {
  const fields = Object.keys(apiModelFields).reduce((memo, field) => {
    const fieldType = apiModelFields[field]
    return {
      ...memo,
      [field]: parseFieldType(fieldType, field === apiModelPk, getStore, getItemModel),
    }
  }, {
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
      getFieldType(field) {
        const fieldType = apiModelFields[field]

        if (!fieldType) {
          return { isSimple: true }
        }

        const fkMatch = fieldType.match(fkRegex)
        if (fkMatch) {
          const fkModelName = fkMatch[1].replace(':', '_')
          return {
            type: getItemModel(fkModelName),
            isReference: true,
          }
        }

        const fkArrayMatch = fieldType.match(fkArrayRegex)
        if (fkArrayMatch) {
          const fkModelName = fkArrayMatch[1].replace(':', '_')
          return {
            type: getItemModel(fkModelName),
            isReference: true,
            isArray: true,
          }
        }

        return {
          type: fieldType,
          isSimple: true,
          isIdentifier: field === apiModelPk,
          isArray: fieldType === 'array',
        }
      },
    }))
}
