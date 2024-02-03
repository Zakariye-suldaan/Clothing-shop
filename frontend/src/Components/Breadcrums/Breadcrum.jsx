import React from 'react';
import './Breadcrum.css';
import arrow_icon from '../Assets/breadcrum_arrow.png';

const Breadcrum = (props) => {
    const { product } = props;

    // Check if the product object is defined
    if (!product) {
        return (
            <div className='breadcrum'>
                HOME
            </div>
        );
    }

    // Check if the expected properties are present in the product object
    const category = product.category || 'Unknown Category';
    const productName = product.name || 'Unknown Product';

    return (
        <div className='breadcrum'>
            HOME<img src={arrow_icon} alt="" />
            SHOP<img src={arrow_icon} alt="" />
            {category}<img src={arrow_icon} alt="" />
            {productName}
        </div>
    );
};

export default Breadcrum;
