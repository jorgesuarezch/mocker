import express, { Response } from 'express'
import { map, omit } from 'lodash'
import { readJSON, getOrCreateExpectationDir } from './app/utils/file'
import { recordRequest } from './app/utils/request'
import { findResponse } from './app/utils/responses'
import { getMatcher } from './app/utils/matchers'

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(async function(req, res) {
  const { path } = req
  const dir = getOrCreateExpectationDir(path)
  const responsesFile = `${dir}/index.json`
  const responses = readJSON(responsesFile)
  const matcher = getMatcher(req)

  const response = findResponse(matcher, responses)

  if (response) {
    const content = readJSON([dir, response.responseFile].join('/'))
    send(res, content)
  } else if (process.env.RECORD === 'true') {
    const content = await recordRequest({ request: req, path: dir, matcher, responses })
    send(res, content)
  } else {
    res.sendStatus(404)
  }
})

const send = (response: Response, content: { data: any; headers: any }): void => {
  // TODO: Move this to configuration var
  map(omit(content.headers, ['transfer-encoding']), (value, header) => {
    response.append(header, value)
  })

  response.send(content.data)
}

app.listen(8000)
