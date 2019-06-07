import { IMatcher,IResponse } from '../interfaces'
import { match } from './matchers'

/**
 * Returns the  first response that matches with the given matcher
 * @param matcher
 * @param availableResponses
 */
export const findResponse = (matcher: IMatcher, availableResponses:IResponse[]):IResponse => {
  return availableResponses.find(r => match(r.matcher, matcher))
}
