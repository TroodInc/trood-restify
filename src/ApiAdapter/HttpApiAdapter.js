import objectHash from 'object-hash'

import { defaultHeaders, defaultAllowNoTokenEndpoints, RESPONSE_FORMATS } from './constants'


class HttpApiAdapter {
  static cache = {}

  constructor({
    apiHost,
    getToken,
    headers,
    allowNoTokenEndpoints,
    defaultResponseFormat,
  } = {}) {
    this.getToken = getToken
    this.apiHost = apiHost
    this.headers = headers || defaultHeaders
    this.allowNoTokenEndpoints = allowNoTokenEndpoints || defaultAllowNoTokenEndpoints
    if (!Array.isArray(this.allowNoTokenEndpoints)) {
      this.allowNoTokenEndpoints = [this.allowNoTokenEndpoints]
    }
    this.defaultResponseFormat = defaultResponseFormat || RESPONSE_FORMATS.json
  }

  async getResponseData(response, uuid, format) {
    const responseFormat = RESPONSE_FORMATS[format || this.defaultResponseFormat]
    if (!responseFormat) {
      console.error(`Error. Unknown format "${format || this.defaultResponseFormat}"`)
      return {
        uuid,
        status: 500,
        error: {
          global: `Unknown format "${format || this.defaultResponseFormat}"`,
        },
      }
    }
    const data = await response[responseFormat]()
    return {
      uuid,
      status: response.status,
      data,
    }
  }

  async callApi(endpoint, {
    method,
    headers: optionsHeaders,
    body,
    filters,
    hash = '',
    format,
    cacheMaxAgeMs = 1000,
  } = {}) {
    let token
    if (typeof this.getToken === 'function') {
      token = this.getToken()
    }
    if (token instanceof Promise) {
      token = await token
    }

    let url = new URL(endpoint, this.apiHost)

    url.hash = hash

    if (filters) {
      if (typeof filters === 'string') {
        url.search = filters
      } else if (typeof filters === 'object' && !Array.isArray(filters)) {
        Object.keys(filters).forEach(key => {
          url.searchParams.set(key, filters[key])
        })
      } else {
        console.error('Error. Incorrect filters format')
        return {
          uuid: objectHash({ url: url.toString(), method }),
          status: 500,
          error: {
            global: 'Incorrect filters format',
          },
        }
      }
    }

    url = url.toString()
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
          uuid,
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
        return undefined
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

    const response = await fetch(url, {
      method,
      body,
      headers,
    })

    const responseData = await this.getResponseData(response, uuid, format)

    if (responseData.status < 400) {
      // set cache real time
      HttpApiAdapter.cache[uuid] = new Date().getTime()
    } else {
      // reset cache time for error
      HttpApiAdapter.cache[uuid] = undefined
    }

    return responseData
  }

  callGet = (endpoint, options = {}) => this.callApi(endpoint, { ...options, method: 'GET', body: undefined })
  callPost = (endpoint, options = {}) => this.callApi(endpoint, { ...options, method: 'POST' })
  callPut = (endpoint, options = {}) => this.callApi(endpoint, { ...options, method: 'PUT' })
  callPatch = (endpoint, options = {}) => this.callApi(endpoint, { ...options, method: 'PATCH' })
  callDelete = (endpoint, options = {}) => this.callApi(endpoint, { ...options, method: 'DELETE' })
}

export default HttpApiAdapter