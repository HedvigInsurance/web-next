declare module 'koa-remove-trailing-slashes' {
  import { Middleware } from 'koa'

  interface RemoveTrailingSlashesArgs {
    defer?: boolean
    chained?: boolean
  }
  const removeTrailingSlashes: <TState = {}, TContext = any>(
    args?: RemoveTrailingSlashesArgs,
  ) => Middleware<TState, TContext>

  export = removeTrailingSlashes
}
