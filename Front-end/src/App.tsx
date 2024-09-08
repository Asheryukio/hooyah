import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Lay from './layout'
import Home from './views/home'
// import Info from './views/info'
// import Foo from './layout/footer'
import store from './redux'
import { Provider } from 'react-redux'

function App() {

  return (
    <>
     <Provider store={store}>
     <HashRouter>
            {/* <GetRouters /> */}
            <Routes>
              <Route path='/' element={<Navigate to='/home'/>} />
              <Route path="/" element={<Lay />} >
                <Route path="home" element={<Home />} />
                {/* <Route path="info" element={<Info />} /> */}
              </Route>
                {/* <Route path="/home" element={<Home />} /> */}
            </Routes>
      </HashRouter>
     </Provider>
      
    </>
  )
}

export default App
