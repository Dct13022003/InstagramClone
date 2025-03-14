import { useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import Login from './pages/login'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: <ProductList />
    },
    {
      path: '/login',
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      )
    },
    {
      path: '/register',
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    }
  ])
  return routeElements
}
