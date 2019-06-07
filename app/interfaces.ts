export interface IMatcher {
  query: object
  body: object
  method: string
  headers: object
}

export interface IResponse {
  matcher: IMatcher
  responseFile: string
}
export interface IRequest {
  method: string
  path: string
  body: object
  headers: object
  query: object
}
