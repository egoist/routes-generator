import { toRoutes } from '../src'

test('simple', () => {
  expect(toRoutes(['index.vue', 'about.vue', 'user/index.vue'])).toMatchSnapshot()
})

test('directory', () => {
  expect(
    toRoutes(['index.vue', 'foo/bar.vue', 'foo/baz.vue'])
  ).toMatchSnapshot()
})

test('nesting routes', () => {
  expect(toRoutes(['index.vue', 'foo.vue', 'foo/bar.vue', 'foo/baz.vue']))
})

test('complex example', () => {
  expect(
    toRoutes([
      '[user].vue',
      '[user]/index.vue',
      '[user]/profile.vue',
      'explore.vue',
      'explore/tweets.vue',
      'post/[post].vue',
      'post/[post]/index.vue',
      'post/[post]/[comment].vue',
      'post/[post]/[comment]/index.vue',
      'post/[post]/[comment]/likes.vue',
      'post/[post]/[comment]/replies.vue'
    ])
  ).toMatchSnapshot()
})
