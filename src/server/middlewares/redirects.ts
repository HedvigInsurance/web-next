import { Middleware } from 'koa'
import { IMiddleware } from 'koa-router'
import { Logger } from 'typescript-logging'
import * as Koa from 'koa'
import { lookupCountry } from 'server/utils/ip2location'
import { getDatasourceEntries } from 'server/utils/storyblok'
import { DatasourceEntry } from 'storyblok/StoryContainer'
import { fallbackLocale, locales } from 'utils/locales'
import { State } from './states'

export const forceHost = ({
  host,
}: {
  host: string
}): Middleware<State, any> => async (ctx, next) => {
  if (ctx.get('host') !== host) {
    ;(ctx.state.getLogger('request') as Logger).info(
      `Redirecting to "${host}" because of host mismatch (got "${ctx.host}")`,
    )
    ctx.redirect(`${ctx.request.protocol}://${host}${ctx.request.originalUrl}`)
    ctx.status = 301
    return
  }

  await next()
}

export const geoRedirect = (
  path: string,
  fallbackCountryLabel = fallbackLocale.label,
): IMiddleware<void> => async (ctx) => {
  const countryLabel =
    lookupCountry(ctx.ip)?.toLowerCase() || fallbackCountryLabel
  const queryStringMaybe = ctx.querystring ? '?' + ctx.querystring : ''

  ctx.status = 301

  if (Object.keys(locales).includes(countryLabel)) {
    ctx.redirect(`/${countryLabel}${path}${queryStringMaybe}`)
  } else {
    ctx.redirect(`/${fallbackCountryLabel}${path}${queryStringMaybe}`)
  }
}

const triggerRedirect = (
  redirect: DatasourceEntry,
  ctx: Koa.ParameterizedContext,
  status: 301 | 302,
) => {
  const queryStringMaybe = ctx.querystring ? '?' + ctx.querystring : ''
  ctx.redirect(`${redirect.value}${queryStringMaybe}`)
  ctx.status = status
}

export const manualRedirects: IMiddleware<State, any> = async (ctx, next) => {
  const permanentRedirects = await getDatasourceEntries('permanent-redirects')
  const temporaryRedirects = await getDatasourceEntries('temporary-redirects')

  const permanentRedirect = permanentRedirects.datasource_entries.find(
    (redirect) => redirect.name === ctx.path,
  )

  if (permanentRedirect) {
    triggerRedirect(permanentRedirect, ctx, 301)
    return
  }

  const temporaryRedirect = temporaryRedirects.datasource_entries.find(
    (redirect) => redirect.name === ctx.path,
  )

  if (temporaryRedirect) {
    triggerRedirect(temporaryRedirect, ctx, 302)
    return
  }

  await next()
}
