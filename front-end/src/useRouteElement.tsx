import Login from './pages/Login'
import Register from './pages/Register'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import ChatPage from './pages/Chat/ChatPage'
import RegisterLayout from './layouts/RegisterLayout'
import MessageList from './components/Chat/MessageList'
import { useContext } from 'react'
import { AppContext } from './context/app.context'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/chat' />
}

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/chat',
          element: <ChatPage />,
          children: [{ path: ':conversationId', element: <MessageList /> }]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
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
      ]
    }
  ])
  return routeElements
}
