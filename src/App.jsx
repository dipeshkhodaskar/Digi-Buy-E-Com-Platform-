import React, { Children } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Home from './pages/home/Home';
import Order from './pages/order/Order';
import AllProducts from './pages/allproducts/AllProducts';
import Cart from './pages/cart/Cart';
import Dashboard from './pages/admin/dashboard/Dashboard';
import NoPage from './pages/nopage/NoPage';
import MyState from './context/data/myState';  // Changed to PascalCase
import Login from './pages/registration/Login';
import Signup from './pages/registration/Signup';
import ProductInfo from './pages/productInfo/ProductInfo';
import AddProduct from './pages/admin/pages/AddProduct';
import UpdateProduct from './pages/admin/pages/UpdateProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <MyState>  {/* PascalCase for component */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<ProtectedRoute>
            <AllProducts />
            </ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute>
            <Order />
          </ProtectedRoute>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<ProtectedRouteForAdmin>
            <Dashboard />
          </ProtectedRouteForAdmin>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/productInfo/:id" element={<ProductInfo/>}/>
          <Route path="/addproduct" element={<ProtectedRouteForAdmin>
            <AddProduct/>
          </ProtectedRouteForAdmin>}/>
          <Route path="/updateproduct" element={<ProtectedRouteForAdmin>
            <UpdateProduct/>
          </ProtectedRouteForAdmin>}/>
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <ToastContainer/>
      </Router>
    </MyState>
  );
}

export default App;

// user
 const ProtectedRoute =({children}) => {
  const user = localStorage.getItem('user')
  if(user){
    return children
  }
  else{
    return <Navigate to={'/login'}/>
  }
 }

 //admin

const ProtectedRouteForAdmin = ({children}) => {
  const admin =JSON.parse(localStorage.getItem('user'))

  if(admin.user.email === 'dipeshvkhodaskar12@gmail.com'){
    return children
  }
  else{
    return <Navigate to={'/login'}/>
  }
}
