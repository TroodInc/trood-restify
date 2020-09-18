import objectHash from 'object-hash'
import get from 'lodash/get'

import {
  defaultHeaders,
  defaultAllowNoTokenEndpoints,
  defaultPaginationTemplate,
  RESPONSE_FORMATS,
} from './constants'


const templateApplyValues = (template, args) => {
  return template.replace(/\{([^{}]+)\}/g, (m, key) => {
    return args[key] !== undefined ? args[key] : m
  })
}

class HttpApiAdapter {
  static cache = {}

  constructor({
    apiHost,
    getToken,
    headers = defaultHeaders,
    allowNoTokenEndpoints = defaultAllowNoTokenEndpoints,
    defaultResponseFormat = RESPONSE_FORMATS.json,
    paginationTemplate = defaultPaginationTemplate,
    entityDataAddress,
    entityErrorAddress,
    arrayDataAddress,
    arrayErrorAddress,
    arrayCountAddress,
  } = {}) {
    this.getToken = getToken
    this.apiHost = apiHost
    this.headers = headers
    this.allowNoTokenEndpoints = allowNoTokenEndpoints
    if (!Array.isArray(this.allowNoTokenEndpoints)) {
      this.allowNoTokenEndpoints = [this.allowNoTokenEndpoints]
    }
    this.defaultResponseFormat = defaultResponseFormat
    this.paginationTemplate = paginationTemplate
    this.entityDataAddress = entityDataAddress
    this.entityErrorAddress = entityErrorAddress
    this.arrayDataAddress = arrayDataAddress
    this.arrayErrorAddress = arrayErrorAddress
    this.arrayCountAddress = arrayCountAddress
  }

  async getResponseData(response, format, pk) {
    const responseFormat = RESPONSE_FORMATS[format || this.defaultResponseFormat]
    if (!responseFormat) {
      console.error(`Error. Unknown format "${format || this.defaultResponseFormat}"`)
      return {
        status: 500,
        error: {
          global: `Unknown format "${format || this.defaultResponseFormat}"`,
        },
      }
    }
    const respData = await response[responseFormat]()
    const respDataAddress = pk ? this.entityDataAddress : this.arrayDataAddress
    const data = respDataAddress ? get(respData, respDataAddress) : respData
    const respErrorAddress = pk ? this.entityErrorAddress : this.arrayErrorAddress
    const error = respErrorAddress ? get(respData, respErrorAddress) : respData
    let count = 1
    if (!pk) {
      count = this.arrayCountAddress ? get(respData, this.arrayCountAddress) : data.length
    }
    return {
      status: response.status,
      data: response.status < 400 ? data : undefined,
      error: response.status < 400 ? undefined : error,
      count,
    }
  }

  getUrl(endpoint, {
    pk,
    filters,
    hash = '',
    page,
    pageSize,
  } = {}) {
    let url
    if (pk) {
      let pkEndpoint
      if (/\/$/.test(endpoint)) {
        pkEndpoint = `${endpoint}${pk}/`
      } else {
        pkEndpoint = `${endpoint}/${pk}`
      }
      url = new URL(pkEndpoint, this.apiHost)
    } else {
      url = new URL(endpoint, this.apiHost)
    }

    url.hash = hash

    if (filters) {
      if (typeof filters === 'string') {
        url.search = filters
      } else if (typeof filters === 'object' && !Array.isArray(filters)) {
        Object.keys(filters).forEach(key => {
          const keyValue = filters[key]
          if (Array.isArray(keyValue)) {
            keyValue.forEach(item => {
              url.searchParams.append(key, item)
            })
          } else {
            url.searchParams.append(key, keyValue)
          }
        })
      } else {
        throw new Error('Incorrect filters format')
      }
    }

    if (pageSize) {
      const offset = page * pageSize
      const paginationString = templateApplyValues(this.paginationTemplate, { page, pageSize, offset })
      const tmpUrl = new URL('http://trood.com')
      tmpUrl.search = paginationString
      for (let key of tmpUrl.searchParams.keys()) {
        const keyValue = tmpUrl.searchParams.getAll(key)
        if (Array.isArray(keyValue)) {
          keyValue.forEach(item => {
            url.searchParams.append(key, item)
          })
        } else {
          url.searchParams.append(key, keyValue)
        }
      }
    }

    return url.toString()
  }

  async callApi(
    endpoint,
    {
      pk,
      method,
      headers: optionsHeaders,
      body,
      filters,
      page,
      pageSize,
      hash,
      format,
      cacheMaxAgeMs = 60 * 1000,
    } = {},
    beforeHttpCall = () => {},
  ) {
    let token
    if (typeof this.getToken === 'function') {
      token = this.getToken()
    }
    if (token instanceof Promise) {
      token = await token
    }

    let url
    try {
      url = this.getUrl(endpoint, {
        pk,
        filters,
        hash,
        page,
        pageSize,
      })
    } catch (e) {
      console.error(`Error. ${e}`)
      return {
        status: 500,
        error: {
          global: e,
        },
      }
    }

    const uuid = objectHash({ url, method })

    if (!token) {
      const isTokenRequired = !this.allowNoTokenEndpoints.some(item => {
        if (typeof item === 'string') return item === endpoint
        if (item instanceof RegExp) return item.test(endpoint)
        return false
      })
      if (isTokenRequired) {
        console.warn(`Called ${url} which requires token, but there was no token found!`)
        return {
          status: 401,
          error: {
            global: `Authorization token is required`,
          },
        }
      }
    }

    const currentTime = new Date().getTime()
    if (method === 'GET') {
      const urlCachedTime = HttpApiAdapter.cache[uuid] || 0
      if (urlCachedTime + cacheMaxAgeMs > currentTime) {
        return {
          status: 0, // cache status
        }
      }
      if (!urlCachedTime) {
        // set cache pre time
        HttpApiAdapter.cache[uuid] = currentTime
      }
    }

    let headers
    if (token) {
      headers = { 'Authorization': token }
    }

    headers = {
      ...headers,
      ...this.headers,
      ...optionsHeaders,
    }

    beforeHttpCall()

    const response = await fetch(url, {
      method,
      body,
      headers,
    })

    const responseData = await this.getResponseData(response, format, pk)

    if (responseData.error) {
      // reset cache time for error
      HttpApiAdapter.cache[uuid] = undefined
    } else {
      // set cache real time
      HttpApiAdapter.cache[uuid] = new Date().getTime()
    }

    return responseData
  }

  callGet = (endpoint, options = {}, ...other) =>
    this.callApi(endpoint, { ...options, method: 'GET', body: undefined }, ...other)
  callPost = (endpoint, options = {}, ...other) =>
    this.callApi(endpoint, { ...options, method: 'POST' }, ...other)
  callPut = (endpoint, options = {}, ...other) =>
    this.callApi(endpoint, { ...options, method: 'PUT' }, ...other)
  callPatch = (endpoint, options = {}, ...other) =>
    this.callApi(endpoint, { ...options, method: 'PATCH' }, ...other)
  callDelete = (endpoint, options = {}, ...other) =>
    this.callApi(endpoint, { ...options, method: 'DELETE' }, ...other)
}

export default HttpApiAdapter