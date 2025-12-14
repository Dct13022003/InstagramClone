import { useLocation, Routes, Route } from 'react-router-dom'
import useRouteElement from './useRouteElement'
import ModalPostDetail from './components/ModalPostDetail'
import type { Location } from 'react-router-dom'
import ModalCreatePost from './components/Modal'
import { useActiveChatStatus } from './pages/Chat/hook/useConversationSocket'

function App() {
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location<any> }
  const routeElements = useRouteElement(state?.backgroundLocation)
  useActiveChatStatus()
  return (
    <>
      {routeElements}
      {state?.backgroundLocation && (
        <Routes>
          <Route path='/:username/p/:postId' element={<ModalPostDetail />} />
        </Routes>
      )}
      <ModalCreatePost />
    </>
  )
}

export default App
