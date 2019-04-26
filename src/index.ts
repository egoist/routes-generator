import path from 'path'
import sortRoutes from './sort-routes'

export interface Route {
  path: string
  component: string
  name: string
  children?: Route[]
}

function groupRoutes(
  routes: Set<Route>,
  rootRoutes: Set<Route> = routes
): Set<Route> {
  for (const route of routes) {
    const childRoutes: Set<Route> = new Set()
    for (const _route of routes) {
      if (_route.path.startsWith(`${route.path}/`)) {
        routes.delete(_route)
        rootRoutes.delete(_route)
        childRoutes.add(_route)
      }
    }
    if (childRoutes.size > 0) {
      route.children = sortRoutes(
        [...groupRoutes(childRoutes, rootRoutes)].map(childRoute => {
          let childPath = childRoute.path.slice(route.path.length + 1)
          if (childPath === 'index') {
            childPath = ''
          }
          return {
            ...childRoute,
            path: childPath
          }
        })
      ).map(sorted => sorted.route)
    }
  }
  return new Set(sortRoutes([...routes]).map(sorted => sorted.route))
}

export function toRoutes(
  files: Array<string> | Set<string>,
  { cwd = '' } = {}
): Route[] {
  // Sort files in ASC so that we handle sorter path first
  files = [...files].sort()
  const routes: Set<Route> = new Set()
  for (const filePath of files) {
    const routePath = filePathToRoutePath(filePath)
    routes.add({
      path: routePath,
      component: path.join(cwd, filePath),
      name: getRouteName(filePath)
    })
  }
  const groupedRoutes = groupRoutes(routes)
  return [...groupedRoutes]
}

function filePathToRoutePath(filePath: string) {
  const routePath = `/${filePath}`
    .replace(/\.[a-z]+$/i, '') // Remove extension
    .replace(/\[([^\]]+)\]/g, ':$1')
  if (routePath === '/index') {
    return '/'
  }
  return routePath
}

function getRouteName(filePath: string) {
  return filePath.replace(/[^a-z0-9_-]/gi, '-')
}
