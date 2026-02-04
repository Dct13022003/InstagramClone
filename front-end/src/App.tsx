import { useLocation, useNavigationType } from 'react-router-dom'
import useRouteElement from './useRouteElement'

import type { Location } from 'react-router-dom'

import { useActiveChatStatus } from './pages/Chat/hook/useConversationSocket'
import ModalCreatePost from './components/Modal'

function App() {
  const location = useLocation()
  const navType = useNavigationType()
  const state = location.state as { backgroundLocation?: Location }
  const routeElements = useRouteElement(navType === 'PUSH' ? state?.backgroundLocation : undefined)
  useActiveChatStatus()
  return (
    <>
      {routeElements}
      <ModalCreatePost />
    </>
  )
}

export default App
