import { IMatcher, IResponse } from '../interfaces'
import { findResponse } from './responses'

describe('responses utils', () => {
  describe('findResponse', () => {
    const matcher1: IMatcher = {
      query: { id: 1 },
      method: 'GET',
      headers: { header: 'value' },
      body: {},
    }
    const matcher2: IMatcher = {
      query: { id: 1 },
      method: 'GET',
      headers: { header: 'other value' },
      body: {},
    }
    const responses: IResponse[] = [
      {
        matcher: {
          query: { id: 1 },
          method: 'GET',
          headers: { header: 'value' },
          body: {},
        },
        responseFile: 'file.json',
      },
      {
        matcher: {
          query: { id: 1 },
          method: 'GET',
          headers: {},
          body: {},
        },
        responseFile: 'file1.json',
      },
    ]
    it('should return first response that matches with the matcher response', () => {
      expect(findResponse(matcher1, responses)).toMatchObject(responses[0])
      expect(findResponse(matcher2, responses)).toMatchObject(responses[1])
    })
  })
})
