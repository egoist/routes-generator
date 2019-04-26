# @egoist/routes-generator

[![NPM version](https://badgen.net/npm/v/@egoist/routes-generator)](https://npmjs.com/package/@egoist/routes-generator) [![NPM downloads](https://badgen.net/npm/dm/@egoist/routes-generator)](https://npmjs.com/package/@egoist/routes-generator) [![CircleCI](https://badgen.net/circleci/github/egoist/routes-generator/master)](https://circleci.com/gh/egoist/routes-generator/tree/master) [![donate](https://badgen.net/badge/support%20me/donate/ff69b4)](https://patreon.com/egoist) [![chat](https://badgen.net/badge/chat%20on/discord/7289DA)](https://chat.egoist.moe)

> Generate routes from filesystem, use case: Next/Nuxt-style routing

## Install

```bash
yarn add @egoist/routes-generator
```

## Usage

The kitchen sink example, generate routes array from files:

```js
const { toRoutes } = require('@egoist/routes-generator')

const files = [
  '[user].vue',
  '[user]/index.vue',
  '[user]/profile.vue',
  'index.vue'
]
const expectedRoutes = [
  {
    path: '/',
    component: '/my-app/index.vue',
    name: 'index-vue'
  },
  {
    path: '/:user',
    component: '/my-app/[user].vue',
    name: '-user--vue',
    children: [
      {
        path: '',
        component: '/my-app/[user]/index.vue',
        name: '-user--index-vue'
      },
      {
        path: 'profile',
        component: '/my-app/[user]/profile.vue',
        name: '-user--profile-vue'
      }
    ]
  }
]

assert.deepEqual(
  toRoutes(files, {
    cwd: '/my-app'
  }),
  expectedRoutes
)
```

### Nesting Routes

When both a file and a directory with the same name as the file exist, the files in the directory will be used as child routes:

In:

```
user.vue
user/index.vue
user/profile.vue
```

Out:

```js
{
  path: '/user',
  component: 'user.vue',
  children: [
    {
      path: '',
      component: 'user/index.vue'
    },
    {
      path: 'profile',
      component: 'user/profile.vue'
    }
  ]
}
```

### Use with `fast-glob` and `chokidar`:

```bash
yarn add fast-glob chokidar
```

```js
const { toRoutes } = require('@egoist/routes-generator')
const glob = require('fast-glob')
const chokidar = require('chokidar')

const patterns = ['**/*.vue']
const cwd = './src/routs'

const files = new Set(glob.sync(patterns, { cwd }))
let routes = toRoutes(files, { cwd })

const watcher = chokidar.watch(patterns, { cwd, ignoreInitial: true })
watcher.on('add', file => {
  files.add(file)
  routes = toRoutes(files, { cwd })
})
watcher.on('unlink', file => {
  files.delete(file)
  routes = toRoutes(files, { cwd })
})
```

## API

### `toRoutes(files, options)`

- Params:
  - `files`: `Set<string> | Array<string>`
  - `options={}`:
    - `cwd=''`: `string`

Convert an array (or set) of files to routes.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**@egoist/routes-generator** © [EGOIST](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/routes-generator/contributors)).

> [egoist.sh](https://egoist.sh) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@\_egoistlily](https://twitter.com/_egoistlily)
