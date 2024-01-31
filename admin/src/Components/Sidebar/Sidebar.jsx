import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import addproduct_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'
import dashboard from '../../assets/dashboard.png'


const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
            <div className="sidebar-item">
                <img src={addproduct_icon} alt="" />
                <p>Add Product</p>
            </div>
        </Link>
        <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>Products List</p>
            </div>
        </Link>
        <Link to={"/dashboard"} style={{ textDecoration: "none" }}>
            <div className="sidebar-item">
                <img src={dashboard} alt="" />
                <p>Dashboard</p>
            </div>
        </Link>

    </div>
  )
}

export default Sidebar