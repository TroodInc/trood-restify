import { types } from 'mobx-state-tree'


const fkRegex = /fk\((.*)\)/
const fkArrayRegex = /fk_array\((.*)\)/

const getFkType = (modelName, getStore, getItemModel) => {
  return types.late(() => types.reference(
    getItemModel(modelName),
    {
      get(pk) {
        const store = getStore()
        return store[modelName].items.get(pk)
      },
      set(value, parent) {
        console.log(value, parent)
        // TODO this method don't called now. Maybe realization incorrect
        return value
      }
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
    return types.maybeNull(getFkType(fkMatch[1], getStore, getItemModel))
  }

  const fkArrayMatch = fieldType.match(fkArrayRegex)
  if (fkArrayMatch) {
    return types.maybeNull(types.array(getFkType(fkArrayMatch[1], getStore, getItemModel)))
  }

  return types.maybeNull(types.frozen())
}

export default (modelName, modelMeta, getStore, getItemModel) => {
  const fields = Object.keys(modelMeta.fields).reduce((memo, field) => {
    const fieldType = modelMeta.fields[field]
    return {
      ...memo,
      [field]: parseFieldType(fieldType, field === modelMeta.pk, getStore, getItemModel),
    }
  }, {
    $loadedById: false,
  })
  return types.model(modelName, fields)
    .views(self => ({
      get pk() {
        return self[modelMeta.pk]
      },
      getFieldType(field) {
        const fieldType = modelMeta.fields[field]

        const fkMatch = fieldType.match(fkRegex)
        if (fkMatch) {
          return {
            type: getItemModel(fkMatch[1]),
            isReference: true,
          }
        }

        const fkArrayMatch = fieldType.match(fkArrayRegex)
        if (fkArrayMatch) {
          return {
            type: getItemModel(fkArrayMatch[1]),
            isReference: true,
            isReferenceArray: true,
          }
        }

        return {
          type: fieldType,
          isSimple: true,
          isIdentifier: field === modelMeta.pk,
        }
      }
    }))
}
