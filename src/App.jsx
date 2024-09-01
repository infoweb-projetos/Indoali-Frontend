import './App.css'
import Dashboard from './Components/Dashboard/Dashboard.jsx'
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <div><Login/></div>
  },
  {
    path: '/register',
    element: <div><Register/></div>
  },
  {
    path: '/',
    element: <div><Dashboard/></div>
  }
])

function App() {

  return (
    <div>
      <RouterProvider router = {router}/>
    </div>
  )
}

export default App
