import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptin-navigator">
            <div className="descriptin-nav-box">Description</div>
            <div className="descriptin-nav-box fade">Reviews(122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>Welcome to our online clothing emporium, where fashion meets convenience.
            Explore an exquisite array of trendy apparel curated for every style enthusiast.
            Immerse yourself in a seamless shopping experience, where quality and elegance are just a click away.</p>
            <p>Step into a world of sartorial splendor at our e-commerce clothing haven. 
            Uncover a diverse collection of chic garments tailored to elevate your wardrobe.
            Enjoy the ease of browsing through the latest trends, as we bring the runway to your fingertips.</p>
        </div>
    </div>
  )
}

export default DescriptionBox
