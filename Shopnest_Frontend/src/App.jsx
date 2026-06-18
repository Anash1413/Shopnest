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
import AdminDashboard from "./pages/AdminDashboard.jsx"
import AdminOrders from "./pages/AdminOrders.jsx"
import AdminOrderDetails from "./pages/AdminOrderDetails.jsx"
import Register from "./pages/Register.jsx"
import Footer from "./components/Footer.jsx"
import OTP from "./pages/OTP.jsx"
import Products from "./pages/Products.jsx"
import NotFound from "./pages/NotFound.jsx"
import AddProduct from "./pages/AddProduct.jsx"
import { Toaster } from "react-hot-toast"


const Layout = () =>{
  return(
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
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
    path:'/register',
    element:<Register/>
  },
  {
    path:'/logout',
    element:<Logout/>
  },
  {element: <ProtectedRouts adminOnly={false}/>
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
  path:'/orders/:id',
  element:<OrderDetails/>
},
{
  path:'/payments/:id',
  element:<PaymentDetails/> 
},
{
  path:'/products',
  element:<Products/>
},
{
  path:'/product/:id',
element:<ProductDetail/>
},
{
  path:'/verify',
element:<OTP/>
}
]
  },
  // --- Admin Only Routes ---
  {
    element: <ProtectedRouts adminOnly={true} />, // Wrapper layout with props
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path:"/admin/orders" , element:<AdminOrders/>},
      { path:"/admin-orders/:id" , element:<AdminOrderDetails/>},
      { path: "/admin/add-product", element: <AddProduct /> }
    ],
  },
  {
    path: "*",
    element: <NotFound />
  }
    ]
  }
 ])
function App() {

  return ( <div className="bg-black">
 <Toaster position="bottom-center" />
  <RouterProvider  router={router}/>
  </div>
  )
}

export default App


 