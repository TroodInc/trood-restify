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


### Store methods

Store contains methods for specific objects

in next `objStore = store.<objectName>`, where `<objectName>` is `<apiName>_<object>`.
example: `store.myApi_object1`

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
  "headers": <object>, // same as headers in API config; added or replaced api headers
  "hash": <sthing>, // http request hash parameter
  "cacheMaxAgeMs": <number>, // cache life time; default 1 min (60 * 1000)
  "filters": <string|object>, // http request argumest;
  // you can use args for pagination in whis place, but it not recomended
}
```

***functions parameters pageSize, options.filters and options.hash - is identify group of pages**
