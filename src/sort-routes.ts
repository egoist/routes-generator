interface Route {
  path: string
}

const paramRe = /^:(.+)/

const ROOT_POINTS = 100 // `/` path goes top
const SEGMENT_POINTS = 4
const STATIC_POINTS = 3
const DYNAMIC_POINTS = 2
const SPLAT_PENALTY = 1

const isRootSegment = (segment: string) => segment === ''
const isDynamic = (segment: string) => paramRe.test(segment)
const isSplat = (segment: string) => segment === '*'

function segmentize(uri: string) {
  return (
    uri
      // strip starting/ending slashes
      .replace(/\/{2,}/, '/')
      .replace(/(^\/|\/$)/g, '')
      .split('/')
  )
}

function rankRoute<T extends Route>(route: T, index: number) {
  let score = segmentize(route.path).reduce((score, segment) => {
    score += SEGMENT_POINTS
    if (isRootSegment(segment)) score += ROOT_POINTS
    else if (isDynamic(segment)) score += DYNAMIC_POINTS
    else if (isSplat(segment)) score -= SEGMENT_POINTS + SPLAT_PENALTY
    else score += STATIC_POINTS
    return score
  }, 0)

  return {
    route,
    score,
    index
  }
}

function sortRoutes<T extends Route>(routes: T[]) {
  return routes
    .map(rankRoute)
    .sort((a, b) =>
      a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
    )
}

export default sortRoutes
