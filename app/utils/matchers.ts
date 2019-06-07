import { defaultsDeep, pick, defaults } from 'lodash'
import * as equal from 'fast-deep-equal'
import { IMatcher } from '../interfaces'

/**
 * Verify if given object accomplish with the matcher expectations
 * TODO: optimize
 * @param a given object
 * @param m matcher expected
 */
export const match = (m: IMatcher, a: Object) => {
  const object: Object = defaultsDeep({}, m, a)
  return equal(a, object)
}

/**
 * Returns a valid matcher object
 * @param object
 */
export const getMatcher = (object: any): IMatcher =>
  defaults(pick(object, ['query', 'body', 'method', 'headers']), {
    query: {},
    body: {},
    method: '',
    headers: {},
  })
