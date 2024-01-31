import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navlogo} className='nav-logo' alt="" />
        </div>
  )
}

export default Navbar