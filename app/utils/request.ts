import axios from 'axios'
import { omit, pick } from 'lodash'

import { IMatcher, IRequest } from '../interfaces'
import { generateFileName, saveJSON } from './file'

const instance = axios.create({
  baseURL: process.env.SERVICE_URL,
})

export const doRequest = (request: IRequest) => {
  const { path, headers, query, body, method } = request
  return instance.request({
    url: path,
    method: method.toLowerCase(),
    params: query,
    data: body,
    headers: omit(headers, ['host']),
    withCredentials: true,
  })
}

export const recordRequest = async ({
  request,
  path,
  matcher,
  responses,
}: {
  request: IRequest
  path: string
  matcher: IMatcher
  responses: any
}) => {
  const filename = generateFileName()
  let response = null
  try {
    response = await doRequest(request)
  } catch (error) {
    response = error
  }
  saveJSON(path, filename, pick(response, ['data', 'headers']))
  saveJSON(path, 'index.json', [
    ...responses,
    {
      matcher,
      responseFile: filename,
    },
  ])
  return response
}
