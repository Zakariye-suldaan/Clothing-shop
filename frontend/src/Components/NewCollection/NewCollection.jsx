import React from 'react'
import './NewCollection.css'
import New_Collection from '../Assets/new_collections'
import Item from '../Item/Item'

const NewCollection = () => {
  return (
    <div className='new-collections'>
      <h1>New Collection</h1>
      <hr />
      <div className='collection'>
        {New_Collection.map((item,i) => (
           <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        ))}
      </div>
    </div>
  )
}
export default NewCollection
