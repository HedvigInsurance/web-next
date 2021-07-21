import { promisify } from 'util'
import { IMiddleware } from 'koa-router'
import { Changefreq, createSitemap, Url } from 'sitemap'
import { Logger } from 'typescript-logging'
import { redisClient } from 'server/utils/redis'
import { BodyStory } from 'storyblok/StoryContainer'
import { State } from './middlewares/states'
import {
  getAllStoryblokLinks,
  getPublishedStoryFromSlug,
} from './utils/storyblok'
import { sleep } from './utils/time'

export interface SitemapXml {
  urlset: {
    url: ReadonlyArray<{
      loc: [string]
      changefreq: [Changefreq]
      priority: [string]
    }>
  }
}

const getSitemapLinks = async (logger: Logger): Promise<ReadonlyArray<Url>> => {
  const cachedSitemapMaybe = await redisClient.get('hvg:sitemap')
  if (cachedSitemapMaybe) {
    logger.info('Sitemap cache hit, using cached version')
    return JSON.parse(cachedSitemapMaybe)
  }

  const nextLinks = await getAllStoryblokLinks()
  const urls = Object.keys(nextLinks.data.links)
    .filter(
      (key) =>
        nextLinks.data.links[key].published &&
        !nextLinks.data.links[key].is_folder &&
        !/^[\w]{2}(-[\w]{2})?\/global\//.test(nextLinks.data.links[key].slug),
    )
    .map(
      (key) =>
        '/' + nextLinks.data.links[key].slug.replace(/(^|\/)home$/, '$1'),
    )
    .map((url) => url.replace(/(.+)\/$/, '$1'))

  const pages: Array<{ url: string; page: { story: BodyStory } | null }> = []

  for (let index = 0; pages.length < urls.length; index++) {
    const url = urls[index]
    try {
      const page = await getPublishedStoryFromSlug(url)
      pages.push({ url, page })
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(`Unable to get page ${url}`, e)
      pages.push({ url, page: null })
    }
    await sleep(1000 / 50 + 10) // storyblok has a rate limit of 50 reqs per second, + some margin
  }

  const sitemapLinks = pages
    .filter(({ url }) => Boolean(url))
    .filter(({ page }) => page?.story?.content?.robots === 'index')
    .filter(({ page }) => page?.story.content?.public === true)
    .map(({ url }) => ({
      url,
      priority: 0.7,
      changefreq: 'daily' as Changefreq,
    }))

  redisClient.set('hvg:sitemap', JSON.stringify(sitemapLinks))
  logger.info('Storing sitemap in cache')

  return sitemapLinks
}

export const sitemapXml: IMiddleware<State> = async (ctx) => {
  const sitemapCreator = createSitemap({
    hostname: process.env.PUBLIC_HOST || undefined,
    cacheTime: 60 * 10 * 1000,
    urls: await getSitemapLinks(ctx.state.getLogger('sitemap')),
  })
  // Something breaks if we pass `undefined` as a first argument but promisify requires us to do it = just ignore this
  // @ts-ignore
  const sitemap = await promisify(sitemapCreator.toXML.bind(sitemapCreator))()
  ctx.type = 'xml'
  ctx.body = sitemap
}

export const warmSitemapCache = (logger: Logger) => {
  logger.info('Warming sitemap cache')
  getSitemapLinks(logger).then((links) => {
    logger.info(`Sitemap cache warm, found ${links.length} links`)
  })
}
