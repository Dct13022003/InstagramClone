import Login from './pages/Login'
import Register from './pages/Register'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import ChatPage from './pages/Chat/ChatPage'

import MessageList from './components/Chat/MessageList'
import React, { useContext } from 'react'
import { AppContext } from './context/app.context'
import path from './constants/path'
import MainLayout from './layouts/MainLayout'

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
          path: '',
          element: React.createElement(MainLayout),
          children: [
            {
              path: path.chat,
              element: <ChatPage />,
              children: [
                {
                  path: ':conversationId',
                  element: <MessageList />
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: <Login />
        },
        {
          path: path.register,
          element: <Register />
        }
      ]
    }
  ])
  return routeElements
}
