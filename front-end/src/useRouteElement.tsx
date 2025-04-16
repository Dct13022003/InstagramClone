import ProductList from './pages/ProductList'
import Login from './pages/Login'
import Register from './pages/Register'
import { useRoutes } from 'react-router-dom'

import ChatPage from './pages/Chat/ChatPage'
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
    },
    {
      path: '/chat',
      element: <ChatPage />
    }
  ])
  return routeElements
}
