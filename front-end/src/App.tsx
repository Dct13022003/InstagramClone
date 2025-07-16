import Modal from './components/Modal'
import useRouteElement from './useRouteElement'

function App() {
  const routeElements = useRouteElement()
  return (
    <div>
      {routeElements}
      <Modal />
    </div>
  )
}

export default App
