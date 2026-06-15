import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import OrderDetails from "./pages/OrderDetails"
import PaymentDetails from "./pages/PaymentDetails.jsx"
import ProductDetail from "./pages/ProductDetail"
import Profile from "./pages/Profile"
import ProtectedRouts from "./components/ProtectedRouts"
import Logout from "./pages/Logout.jsx"
import Orders from "./pages/Orders"
import Cart from "./pages/Cart"
import Navbar from "./components/Navbar.jsx"

const Layout = () =>{
  return(
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}
const router = createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      {
    path:'/',
    element: <Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/logout',
    element:<Logout/>
  },
  {element: <ProtectedRouts/>
    ,children:[
      {
    path:'/orders',
    element:<Orders/>
  },
  {
    path:'/cart',
    element:<Cart/>     
  },
{
  path:'/profile',
  element:  <Profile />
}  ,
{
  path:'/orders/:orderid',
  element:<OrderDetails/>
},
{
  path:'/payments/:id',
  element:<PaymentDetails/> 
},
{
  path:'/product/:id',
element:<ProductDetail/>
},
]
  }
    ]
  }
 ])
function App() {
  return ( <div className="bg-black">

  <RouterProvider  router={router}/>
  </div>
  )
}

export default App


 