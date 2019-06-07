import { IMatcher } from '../interfaces'
import { getMatcher, match } from './matchers'

describe('matchers utils', () => {
  describe('match', () => {
    const matcher: IMatcher = {
      query: { id: 1 },
      headers: {
        'Accept Header': true,
      },
      body: {},
      method: 'POST',
    }
    it('should return true when the given data contains all the matcher values', () => {
      expect(
        match(matcher, {
          ...matcher,
          query: { id: 1, sort: 'desc', otherParam: 'any' },
          extra: 'DATA',
        }),
      ).toBeTruthy()
    })
    it('should return false if the given data contains at least 1 different value', () => {
      expect(match(matcher, { ...matcher, query: { id: 2 }, extra: 'DATA' })).toBeFalsy()
    })
  })
  describe('getMatcher', () => {
    it('should return a valid matcher object', () => {
      const matcher = getMatcher({})
      expect(matcher).toHaveProperty('query')
      expect(matcher).toHaveProperty('method')
      expect(matcher).toHaveProperty('headers')
      expect(matcher).toHaveProperty('body')
    })
  })
})
