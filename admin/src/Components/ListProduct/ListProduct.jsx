import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import delete_icon from '../../assets/delete.png';
import update_icon from '../../assets/update.png';

const ListProduct = () => {
  const [all_products, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const showToast = (message, type) => {
    toast[type](message, {
      position: 'top-center',
    });
  };

  const fetchAllProducts = async () => {
    const response = await fetch('http://localhost:7000/allproducts');
    const data = await response.json();
    setAllProducts(data);
  };

  const remove_Product = async (id) => {
    try {
      const response = await fetch('http://localhost:7000/removeproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });

      if (response.ok) {
        // Product removed successfully
        showToast('Product removed successfully', 'success');
        await fetchAllProducts();
      } else {
        // Product removal failed
        showToast('Failed to remove product', 'error');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      showToast('An error occurred while removing the product', 'error');
    }
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const update_Product = async (updatedProduct) => {
    try {
      const response = await fetch('http://localhost:7000/updateproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        // Product updated successfully
        showToast('Product updated successfully', 'success');
        closeUpdateModal();
        await fetchAllProducts();
      } else {
        // Product update failed
        showToast('Failed to update product', 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('An error occurred while updating the product', 'error');
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className='listproduct'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Delete</p>
        <p>Update</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {all_products.map((product, index) => (
          <div className="listproduct-format-main listproduct-product" key={index}>
            <img src={product.image} className='listproduct-product-img' alt="" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img
              onClick={() => remove_Product(product.id)}
              className='listproduct-product-delete'
              src={delete_icon}
              alt=""
            />
            <img
              onClick={() => openUpdateModal(product)}
              className='listproduct-product-delete'
              src={update_icon}
              alt=""
            />
          </div>
        ))}
      </div>
      {isUpdateModalOpen && selectedProduct && (
        <div className="update-modal">
          <h2>Update Product</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const updatedProduct = {
              id: selectedProduct.id,
              name: e.target.elements.name.value,
              image: e.target.elements.image.value,
              category: e.target.elements.category.value,
              new_price: parseFloat(e.target.elements.new_price.value),
              old_price: parseFloat(e.target.elements.old_price.value),
            };
            update_Product(updatedProduct);
          }}>
            <label htmlFor="name">Product Name:</label>
            <input type="text" id="name" defaultValue={selectedProduct.name} required />

            <label htmlFor="image">Image URL:</label>
            <input type="text" id="image" defaultValue={selectedProduct.image} required />

            <label htmlFor="category">Category:</label>
            <input type="text" id="category" defaultValue={selectedProduct.category} required />

            <label htmlFor="new_price">New Price:</label>
            <input type="number" id="new_price" defaultValue={selectedProduct.new_price} required />

            <label htmlFor="old_price">Old Price:</label>
            <input type="number" id="old_price" defaultValue={selectedProduct.old_price} required />

            <button type="submit">Update Product</button>
            <button onClick={closeUpdateModal}>Close Modal</button>
          </form>
        </div>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ListProduct;
