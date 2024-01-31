import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import cart_dashboard from '../../assets/cart_dashboard.png';
import total_users from '../../assets/total_users.png';

const DashboardPage = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const response = await fetch('http://localhost:7000/allproducts');
        const data = await response.json();
        setTotalProducts(data.length);
      } catch (error) {
        console.error('Error fetching total products:', error);
      }
    };

    fetchTotalProducts();
  }, []);
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch('http://localhost:7000/users');
        const data = await response.json();

        // Assuming data.users is an array of users
        setTotalUsers(data.users.length);
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    // Don't forget to actually call the function
    fetchTotalUsers();
  }, []);

  return (
    <div className='dashboard'>
      <h1>DashboardPage</h1>
      {/* Render total number of products */}
      <div className="total-products">
        <p>Total Products</p>
        <p>{totalProducts}</p>
        <img src={cart_dashboard} alt="Cart Dashboard" />
      </div>
      <div className="total-users">
        <p>Total Users</p>
        <p>{totalUsers}</p>
        <img src={total_users} alt="Cart Dashboard" />
      </div>
    </div>
  );
};

export default DashboardPage;
