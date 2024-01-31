import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import dropdown_icon from '../Assets/dropdown_icon.png'
import Item from '../Item/Item'
import { ShopContext } from '../Context/ShopContext'
const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext)
  
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexsort">
        <p>
          <span>showing 1-12</span>out of 36 product
        </p>
        <div className="shopcategorysort">
          sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />;
          } else {
            return null;
          }
        })}

      </div>
      <div className="shop-loadmore">
        Explore More
      </div>
    </div>
  )
}
export default ShopCategory
