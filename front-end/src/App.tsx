import { useLocation } from 'react-router-dom'
import useRouteElement from './useRouteElement'

import type { Location } from 'react-router-dom'

import { useActiveChatStatus } from './pages/Chat/hook/useConversationSocket'
import ModalCreatePost from './components/Modal'

function App() {
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location<any> }
  const routeElements = useRouteElement(state?.backgroundLocation)
  useActiveChatStatus()
  return (
    <>
      {routeElements}
      <ModalCreatePost />
    </>
  )
}

export default App
