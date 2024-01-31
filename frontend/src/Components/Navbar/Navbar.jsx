import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);

  const userString = localStorage.getItem('user');
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (userString) {
      const userObject = JSON.parse(userString);
      setUserName(userObject.name);
    }
  }, [userString]);

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>Clothing Shop</p>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}> <Link style={{ textDecoration: "none" }} to="/shop"> Shop </Link> {menu === "shop" ? <hr /> : <></>} </li>
        <li onClick={() => setMenu("mens")}> <Link style={{ textDecoration: "none" }} to="/mens"> Men </Link> {menu === "mens" ? <hr /> : <></>} </li>
        <li onClick={() => setMenu("womens")}> <Link style={{ textDecoration: "none" }} to="/womens"> Women </Link> {menu === "womens" ? <hr /> : <></>} </li>
        <li onClick={() => setMenu("kids")}> <Link style={{ textDecoration: "none" }} to="/kids"> Kids </Link>{menu === "kids" ? <hr /> : <></>} </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ? (
          <>
            <p style={{ fontSize: "20px", fontWeight: "600" }}>Welcome <span style={{ color: "Tomato", fontSize: "1.3rem", fontWeight: "600" }}>{userName}</span></p>
            <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/'); }}>Logout</button>
          </>
        ) : (
          <Link to="/"><button>Login</button></Link>
        )}
        <Link to="/cart"><img src={cart_icon} alt="cart" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
}

export default Navbar;
