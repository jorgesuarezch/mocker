const axios = require('axios')
const fs = require('fs')
jest.mock('axios')
jest.mock('fs')

const requestMock = jest.fn()
axios.create.mockReturnValue({ request: requestMock })

import { doRequest, recordRequest } from './request'

describe('request utils', () => {
  describe('doRequest', () => {
    beforeEach(() => {
      requestMock.mockReset()
    })
    it('should make a request with the correct parameters', async () => {
      const request = {
        path: '/path',
        method: 'method',
        body: { b: 1 },
        headers: { h: 1 },
        query: { q: 1 },
      }
      await doRequest(request)
      expect(requestMock).toBeCalledWith({
        data: { b: 1 },
        headers: { h: 1 },
        method: 'method',
        params: { q: 1 },
        url: '/path',
        withCredentials: true,
      })
    })

    describe('recordRequest', () => {
      const request = {
        path: '/example',
        method: 'method',
        body: { b: 1 },
        headers: { h: 1 },
        query: { q: 1 },
      }
      const responses: any = []
      const path = 'mocks/example'
      const matcher = { method: 'method', body: { b: 1 }, headers: { h: 1 }, query: { q: 1 } }

      beforeEach(() => {
        requestMock.mockReset()
        fs.writeFileSync.mockReset()
      })

      it('should record a success request', async () => {
        await recordRequest({ request, responses, path, matcher })
        expect(requestMock).toHaveBeenCalled()
        expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
      })

      it('should record a failed request', async () => {
        requestMock.mockRejectedValue({})
        await recordRequest({ request, responses, path, matcher })
        expect(requestMock).toHaveBeenCalled()
        expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
      })
    })
  })
})
