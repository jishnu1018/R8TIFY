import React from 'react'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Home1 from "./Pages/Home/Home1"
import Home from './Pages/LoginHome/Home'
import Categories1 from './Pages/Home/Categories1'
import Categories from './Pages/LoginHome/Categories'
import EditProfile from './Pages/LoginHome/EditProfile'
import Profile from './Pages/LoginHome/Profile'
import Addreview from './Pages/LoginHome/Addreview'
import Adminadd from './Pages/ADMIN/Adminadd'
import Admin from './Pages/ADMIN/Admin'
import Adminusers from './Pages/ADMIN/Adminusers'
import AdminProducts from './Pages/ADMIN/Adminproducts'
import EditProduct from './Pages/ADMIN/EditProduct'
import Phones from './Pages/LoginHome/Phones'
import Consoles from './Pages/LoginHome/Consoles'
import Laptops from './Pages/LoginHome/Laptops'
import Cameras from './Pages/LoginHome/Cameras'
import EditReview from './Pages/LoginHome/Editreview'
import Seereviews from './Pages/ADMIN/Seereviews'
import Phones1 from './Pages/Home/Phones1'
import Laptops1 from './Pages/Home/Laptops1'
import Consoles1 from './Pages/Home/Consoles1'
import Cameras1 from './Pages/Home/Cameras1'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Navigate to="/signup" />} />
    <Route path='/home1' element={<Home1 />} />
    <Route path='/categories1' element={<Categories1 />} />
    <Route path='/phones1' element= {<Phones1 />} />
    <Route path='/laptops1' element={<Laptops1/>} />
    <Route path='/consoles1' element={<Consoles1/>} />
    <Route path='/cameras1' element={<Cameras1/>} />

    {/* Login Route */}
    <Route path="/login" element={<Login />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/home' element={<Home />} />
    <Route path='/phones' element={<Phones />} />
    <Route path='/consoles' element={<Consoles />} />
    <Route path='/laptops' element={<Laptops />} />
    <Route path='/cameras' element={<Cameras />} />
    <Route path='/categories' element={<Categories />} />
    <Route path='/editprofile' element={<EditProfile />} />
    <Route path='/profile' element={<Profile />} />
    <Route path='/editreview/:id' element={<EditReview />} />
    <Route path='/seereviews' element={<Seereviews />} />
    
     {/* Admin Route */}
    <Route path='/admin' element={<Admin/>}/>
    <Route path='/adminadd' element={<Adminadd/>}/>
    <Route path='/adminusers' element={<Adminusers/>}/>
    <Route path='/adminproducts' element={<AdminProducts/>}/>
    <Route path='/editproducts/:id' element={<EditProduct/>}/>
    <Route path='/addreview' element={<Addreview />} />

    </Routes>
    </BrowserRouter>
  ) 
}

export default App