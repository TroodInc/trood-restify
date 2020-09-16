export const defaultHeaders = {
  'Content-type': 'application/json; charset=utf-8',
}

export const defaultAllowNoTokenEndpoints = /.*/

export const defaultPaginationTemplate = 'q=limit({offset},{pageSize})'

export const RESPONSE_FORMATS = {
  'json': 'json',
  'text': 'text',
  'blob': 'blob',
  'formData': 'formData',
  'arrayBuffer': 'arrayBuffer',
}
