import { useContext } from 'react'
import { Navigate, Outlet, useLocation, useRoutes, Location } from 'react-router-dom'
import { AppContext } from './context/app.context'
import path from './constants/path'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import ChatPage from './pages/Chat/ChatPage'
import MessageList from './pages/Chat/components/MessageList'
import Profile from './pages/Profile'
import Posts from './pages/Profile/components/Posts'
import Saves from './pages/Profile/components/Saves'
import Login from './pages/Login'
import Register from './pages/Register'
import DetailPost from './pages/DetailPost'
import StoryViewer from './pages/Home/components/StoryViewer'
import ModalPostDetail from './pages/Home/components/ModalPostDetail'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} replace />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.chat} replace />
}

export default function useRouteElement(backgroundLocation?: Location<any>) {
  const location = useLocation()
  const protectedRoutes = {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: path.home, element: <Home /> },
          {
            path: path.chat,
            element: <ChatPage />,
            children: [
              { path: 'request', element: <ChatPage /> },
              { path: ':conversationId', element: <MessageList /> }
            ]
          },
          {
            path: '/:username/p/:postId',
            element: <DetailPost />
          },
          {
            path: '/:username',
            element: <Profile />,
            children: [
              { index: true, element: <Posts /> },
              { path: 'saved', element: <Saves /> },
              { path: 'tagged', element: <Saves /> }
            ]
          },
          {
            path: '/stories/:username',
            element: <StoryViewer />
          }
        ]
      }
    ]
  }

  const rejectedRoutes = {
    element: <RejectedRoute />,
    children: [
      { path: path.login, element: <Login /> },
      { path: path.register, element: <Register /> }
    ]
  }

  const modalRoutes = {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/stories/:username',
        element: <StoryViewer />
      },
      {
        path: '/:username/p/:postId',
        element: <ModalPostDetail />
      }
    ]
  }
  const baseRoutes = [protectedRoutes, rejectedRoutes]

  const baseElement = useRoutes(baseRoutes, backgroundLocation || (location as Location))

  const modalElement = useRoutes([modalRoutes], location as Location)

  return (
    <>
      {baseElement}
      {backgroundLocation ? modalElement : null}
    </>
  )
}
