import sortRoutes from '../src/sort-routes'

test('simple', () => {
  const result = sortRoutes([
    {
      path: '/',
    },
    {
      path: '/:user'
    },
    {
      path: '/post/bar'
    },
    {
      path: '/post/:id'
    },
    {
      path: '/post/foo'
    }
  ])

  expect(result).toMatchSnapshot()
})
