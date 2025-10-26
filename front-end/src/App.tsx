import { useLocation, Routes, Route } from 'react-router-dom'
import useRouteElement from './useRouteElement'
import ModalPostDetail from './components/ModalPostDetail'
import type { Location } from 'react-router-dom'
import ModalCreatePost from './components/Modal'

function App() {
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location<any> }
  const routeElements = useRouteElement(state?.backgroundLocation)
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
