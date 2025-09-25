import Login from './pages/Login'
import Register from './pages/Register'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ChatPage from './pages/Chat/ChatPage'

import React, { useContext } from 'react'
import { AppContext } from './context/app.context'
import path from './constants/path'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile'
import Posts from './pages/Profile/components/Posts'
import Saves from './pages/Profile/components/Saves'
import MessageList from './pages/Chat/components/MessageList'
import DetailPost from './pages/DetailPost'

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
            },
            {
              path: '/:username',
              element: <Profile />,
              children: [
                {
                  index: true,
                  element: <Posts />
                },
                { path: 'saved', element: <Saves /> },
                { path: 'tagged', element: <Saves /> }
              ]
            },
            {
              path: '/:username/p/:postId',
              element: <DetailPost />
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
