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
  allTrashRoutes: Set<Route>
): Set<Route> {
  const trashRoutes = new Set()
  for (const route of routes) {
    if (route.path.endsWith('/index')) {
      const parentRoutePath = route.path.replace(/\/index$/, '')
      let parentRoute: Route | undefined
      const childRoutes: Set<Route> = new Set()
      for (const _route of routes) {
        if (_route.path === parentRoutePath) {
          parentRoute = _route
        } else if (_route.path.startsWith(`${parentRoutePath}/`)) {
          childRoutes.add(_route)
        }
      }
      if (parentRoute) {
        parentRoute.children = sortRoutes(
          [...groupRoutes(childRoutes, allTrashRoutes)].map(childRoute => {
            trashRoutes.add(childRoute)
            allTrashRoutes.add(childRoute)
            let childPath = childRoute.path
            if (route.path === childPath) {
              childPath = ''
            } else {
              childPath = childPath.slice(parentRoutePath.length + 1)
            }
            return {
              ...childRoute,
              path: childPath
            }
          })
        ).map(sorted => sorted.route)
      } else {
        route.path = route.path.replace(/\/index$/, '')
      }
    }
  }
  for (const trash of trashRoutes) {
    routes.delete(trash)
  }
  return new Set(sortRoutes([...routes]).map(sorted => sorted.route))
}

export function toRoutes(
  files: Array<string> | Set<string>,
  { cwd = '' } = {}
): Route[] {
  const routes: Set<Route> = new Set()
  for (const filePath of files) {
    const routePath = filePathToRoutePath(filePath)
    routes.add({
      path: routePath,
      component: path.join(cwd, filePath),
      name: getRouteName(filePath)
    })
  }
  const allTrashRoutes = new Set()
  const groupedRoutes = groupRoutes(routes, allTrashRoutes)
  for (const trash of allTrashRoutes) {
    groupedRoutes.delete(trash)
  }
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
