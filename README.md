# trood-restify

Library for RESTfull API communications and data management based on mobx-state-tree (MST)

### Add to project

```
import { getStore } from './dataLayer'

...

const store = getStore(meta <Object>, getToken <function>)
```

#### argument meta

JSON object with meta data for store configuration

##### *api configuration*
```
{
  "apiName1": {
    "apiHost": "https://test.ru",
    // api host address *is required

    "headers": {
      // JSON with http headers
      // default: "Content-type": "application/json; charset=utf-8"
    },

    "allowNoTokenEndpoints": <string|RegEx|Array(string)|Array(RegEx)>,
    // pattern for endpoints which can call without token
    // default /.*/ - all endpoint

    "paginationTemplate": <string>,
    // string template for pagination http params
    // default "limit={pageSize}&offset={offset}"
    // exist args: {pageNumber} {pageSize} {offset}

    "entityDataAddress": <string>,
    // address for get entity data from root of response in PK request
    // by default data get from root
    // example: "data.entity" - get data from response.data.entity

    "entityErrorAddress": <string>,
    // address for get error data from root of response in PK request
    // by default data get from root

    "genericTypeAddress": <string>,
    // address for get entity type from generic field
    // default "_object"

    "arrayDataAddress": <string>,
    // address for get entity array from root of response in page request
    // by default data get from root

    "arrayErrorAddress": <string>,
    // address for get error data from root of response in page request
    // by default data get from root

    "arrayCountAddress": <string>,
    // address for get entity array from root of response in page request
    // by default count get as arrayData.length

    "objects": {
      "object_name_1": { // object configuration see next },
      "object_name_2": { // object configuration see next },
      ...
    }
  },
  "apiName2": {...},
  ...
}
```

##### *object configuration*
```
{
  "pk": <string>, // name of PK field

  "endpoint": <string>, // endpoint address relative API host

  "fields": {
    "field_name_1": <string>,
    // any of MST simple type without options string|number|integer|boolean|Date
    // more read on https://mobx-state-tree.js.org/overview/types

    "reference_field_name_2": "fk(<object_name>)",
    // field is reference to entity of <object_name>
    // <object_name> can be "fk(object_name_2)" - for object in same API
    // <object_name> can be "fk(apiName2:object_name_2)" - for object in other API
    // <object_name> can be list of objects - "fk(object_name_2, apiName2:object_name_2)" for generic field

    "reference_array_field_name_3": "fk_array(<object_name>)",
    // field is reference to array of entity of <object_name>
    // <object_name> is same as

    "field_name_4": <string>,
    // other names is parse to MST types.frozen()
    // more read on https://mobx-state-tree.js.org/overview/types
  },
}
```

***if field not contained in object configuration - you can't use it in your app**


#### argument getToken

function that return value for Authorization http header

it will be return value in Promise


### API Store methods

#### Default API

By default trood-restify create default API in address `defApi = store.apis.default.default`

Default API only can get and store data (same as in response)

**`defApi.getData(endpoint<string>, options<object>)`** - method return response from endpoint.  
You need use it in mobx observer

**`defApi.asyncGetData(endpoint<string>, options<object>)`** - same as getData, but response return in Promise


#### Configured API

Store contains methods for specific objects

in next `objStore = store.apis.<apiName>.<objectName>`.
example: `store.apis.myApi.object1`

**`objStore.getByPk(<PK>, options<object>)`** - method return entity object.  
You need use it in mobx observer

**`objStore.asyncGetByPk(<PK>, options<object>)`** - same as getByPk, but object return in Promise

**`objStore.getPage(page<number>, pageSize<number>, options<object>)`** -
method return entities array from specific page.  
It use in classic pagination case.  
If page and pageSize is zero or undefined - http request sending without pagination params.  
You need use it in mobx observer

**`objStore.asyncPage(page<number>, pageSize<number>, options<object>)`** - same as getPage,
but entity array return in Promise

**`objStore.getInfinityPages(pageSize<number>, options<object>)`** -
method return entities array from all loaded pages.  
Its use in infinity scroll pagination case.  
If you have loaded pages with number 0,1,2,5,6 - getInfinityPages return entities only from pages 0,1,2  
If pageSize is zero or undefined - http request sending without pagination params.  
You need use it in mobx observer

**`objStore.getInfinityNextPageNumber(pageSize<number>, options<object>)`** -
method return number or undefined.  
If you haven't loaded page - return 0  
If you have loaded pages with number 0,1,2 - return 4  
If you have loaded pages with number 0,1,2,5,6 - return 4  
If total count of entity returned from backend less when nextPageNumber * pageSize - return undefined

**`objStore.getInfinityNextPage(pageSize<number>, options<object>)`** -
method initialize request for load page with pageSize and pageNumber returned from getInfinityNextPageNumber

***options in all method**
```
{
  headers: <object>, // same as headers in API config; added or replaced api headers
  hash: <sthing>, // http request hash parameter
  cacheMaxAgeMs: <number>, // cache life time; default 1 min (60 * 1000)
  filters: <string|object>, // http request arguments;
  // you can use args for pagination in whis place, but it not recomended
}
```

***functions parameters pageSize, options.filters and options.hash - is identify group of pages**

### Forms Store methods

#### getForm
**`
store.forms.getForm({
  apiName,
  modelName,
  modelPk,
  formName,
  values
})
`** - method return form object.  
For edit/create entity from **API Store** you must pass modelPk(only for edit), apiName, modelName  

*Example:*
```
const form = store.forms.getForm({
  apiName: 'apiName1',
  modelName: 'object_name_1',
  modelPk: 1
})
```  
`formName` - specify name of form in store (is required for form without apiName, modelName)  
`values` - object with values for form.data initialize (if you edit entity, it was replaced entity values)
**forms without apiName and modelName will be use defaultAPI**  
  
`store.forms.asyncGetForm` - same as getForm, but form objec return in Promise

#### form options

**`form.data`** - object with form values  
**`form.errors`** - object with form errors  
**`form.hasErrors`** - true if form.errors include string|number|boolean<true> value  

#### form methods

**`form.changeFields(values)`** - change values in form.data.  
*values* - object with values for change  

*Example:*
```
// form.data === {}

form.changeFields({
  field1: 'field1',
  field2: {
    field3: 'field3'
  },
  'field4.field5.field6': 'field6
})

// form.data === {
  field1: 'field1',
  field2: {
    field3: 'field3'
  },
  field4: {
    field5: {
      field6: 'field6
    }
  }
}
```

**`form.changeFieldsErrors(values)`** - same as form.changeFields? but change form.errors.  

**`form.submit(options, remove)`** - start http request with `body = form.data`  
```
options: {
  endpoint: <string>, // specify endpoint if standart does not match
  // its required for form without apiName and modelName
  method: <POST|PATCH|DELETE|GET>,  
  // specify http method (default PATCH if form create with pk or POST if not)
  // its required for form without apiName and modelName
  headers: <object>, // same as headers in API config; added or replaced api headers
  filters: <string|object>, // http request arguments
}
remove - <boolean> if true: form will be removed after submit
```

**`form.remove()`** - remove current form
