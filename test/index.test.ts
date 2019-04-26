import { toRoutes } from '../src'

test('simple', () => {
  expect(toRoutes([
    'index.vue',
    'about.vue',
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
    'post/[post]/[comment]/replies.vue',
  ])).toMatchSnapshot()
})
