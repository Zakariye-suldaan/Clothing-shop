import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Components/Pages/Shop';
import ShopCategory from './Components/Pages/ShopCategory';
import LoginSignup from './Components/Pages/LoginSignup';
import Cart from './Components/Pages/Cart';
import Product from './Components/Pages/Product';
import Footer from './Components/Footer/Footer';
import men_bannner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kids_banner from './Components/Assets/banner_kids.png';
import ForgetPassword from './Components/Pages/ForgetPassword';
import ResetPassword from './Components/Pages/ResetPassword';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('auth-token');
    setLoggedIn(!!authToken);
  }, []);

  return (
    <div>
      <BrowserRouter>
        {loggedIn ? (
          <>
            <Navbar />
            <Routes>
              <Route path='/shop' element={<Shop />} />
              <Route path='/mens' element={<ShopCategory banner={men_bannner} category="men" />} />
              <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
              <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid" />} />
              <Route path='/product' element={<Product />}>
                <Route path=':productId' element={<Product />} />
              </Route>
              <Route path='/cart' element={<Cart />} />
            </Routes>
            <Footer />
          </>
        ) : (
          <Routes>
            <Route path='/' element={<LoginSignup />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path='/resetpassword/:id/:token' element={<ResetPassword/>} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
};

export default App;
