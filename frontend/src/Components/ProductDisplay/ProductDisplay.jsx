import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../Context/ShopContext'

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext)
    if (!product) {
        return null; // or display a loading state or handle the case where product is undefined
    }

    // Check if the image property is defined in the product object
    const productImage = product.image|| 'default-image.jpg';
  return (
    <div className='productdisplay'>
        <div className="productdisplay-left">
            <div className="productdisplayimg-list">
                <img src={productImage} alt="" />
                <img src={productImage} alt="" />
                <img src={productImage} alt="" />
                <img src={productImage} alt="" />
            </div>
            <div className="productdisplay-img">
                <img className='productdisplay-img-main' src={productImage} alt="" />
            </div>

        </div>
        <div className="productdisplay-right">
            <h1>{product.name}</h1>
            <div className="productdisplay-stars">
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_dull_icon} alt="" />
                <p>(20)</p>

            </div>
            <div className="product-prices">
                <div className="product-price-new">
                    ${product.new_price}
                </div>
                <div className="product-price-old">
                    ${product.old_price}
                </div>
            </div>
            <div className="product-description">
                A light weight and durable material will make you stand out from the crowd.
            </div>
            <div className="product-size">
            <h1>Select Size</h1>
                <div className="product-size-list">
                    <div className="product-size-item">
                        S
                    </div>
                    <div className="product-size-item">
                        M
                    </div>
                    <div className="product-size-item">
                        L
                    </div>
                    <div className="product-size-item">
                        XL
                    </div>
                    <div className="product-size-item">
                        XXL
                    </div>

                </div>
                <button onClick={() => addToCart(product.id)}>Add To Cart</button>
                <p className='productright-category'> <span>category : </span> women, T-shirt, crop Top </p>
                <p className='productright-category'> <span>Tags : </span> Modern, Latest</p>

            </div>
            
        </div>
    </div>
  )
}

export default ProductDisplay
