import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: '',
        image: '',
        category: '',
        new_price: '',
        old_price: '',
    });

    const clearForm = () => {
        setProductDetails({
            name: '',
            image: '',
            category: '',
            new_price: '',
            old_price: '',
        });
        setImage(false);
    };

    const showToast = (message, type) => {
        toast[type](message, {
            position: 'top-center',
            closeButton: false,
        });
    };

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value,
        });
    };

    const Add_Product = async () => {
        // Check for empty fields
        if (
            !productDetails.name ||
            !productDetails.category ||
            !productDetails.new_price ||
            !productDetails.old_price ||
            !image
        ) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        console.log(productDetails);
        let responseData;
        let product = productDetails;
        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:7000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        })
            .then((resp) => resp.json())
            .then((data) => {
                responseData = data;
            });

        if (responseData.success) {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:7000/addproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.success) {
                        showToast('Product Added', 'success');
                        //clearForm(); // Clear the form after successful addition
                    } else {
                        showToast('Product Not Added', 'error');
                    }
                });
        }
    };


    return (
        <div className='add-product'>
            <div className='addproduct-itemfield'>
                <p>Product Title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type='text'
                    name='name'
                    placeholder='Type Here'
                />
            </div>
            <div className='addproduct-price'>
                <div className='addproduct-itemfield'>
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type='text'
                        name='old_price'
                        placeholder='Type Here'
                    />
                </div>
                <div className='addproduct-itemfield'>
                    <p>Offer Price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type='text'
                        name='new_price'
                        placeholder='Type Here'
                    />
                </div>
            </div>
            <div className='addproduct-itemfield'>
                <p>Product Category</p>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name='category'
                    className='addproduct-selector'
                >
                    <option value=''>Select Category</option>
                    <option value='women'>Women</option>
                    <option value='men'>Men</option>
                    <option value='kid'>Kid</option>
                </select>
            </div>
            <div className='addproduct-itemfield'>
                <label htmlFor='file-input'>
                    <img
                        src={
                            image
                                ? URL.createObjectURL(image)
                                : upload_area
                        }
                        className='addproduct-thumbnail-img'
                        alt=''
                    />
                </label>
                <input
                    onChange={imageHandler}
                    type='file'
                    name='image'
                    id='file-input'
                    hidden
                />
            </div>
            <button
                onClick={() => Add_Product()}
                className='addproduct-btn'
            >
                Add Product
            </button>

            {/* Include ToastContainer at the end of your component */}
            <ToastContainer position="top-center" />
        </div>
    );
};

export default AddProduct;
