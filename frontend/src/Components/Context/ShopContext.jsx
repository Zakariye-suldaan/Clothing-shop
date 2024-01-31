import React,{ createContext, useEffect, useState } from 'react';


export const ShopContext = React.createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 1; i < 40 + 1; i++) {
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] =useState(getDefaultCart());
    const [all_product, setAllProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:7000/allproducts')
        .then((res) => res.json())
        .then((data) => setAllProducts(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:7000/getcart',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    Accept:'application/json'
                },
                body: "",
            })
            .then((response) => response.json())
            .then((data) => setCartItems(data));
        }
    },[]);
   
    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if(localStorage.getItem('auth-token')){
           fetch('http://localhost:7000/addtocart',{
               method:'POST',
               headers:{
                   'Content-Type':'application/json',
                   'auth-token':`${localStorage.getItem('auth-token')}`,
                   Accept:'application/json'
               },
               body:JSON.stringify({"itemId":itemId}),
           })
           .then((response) => response.json())
           .then((data) => console.log(data));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:7000/removefromcart',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    Accept:'application/json'
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    }
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                totalAmount += cartItems[item] * itemInfo.new_price;
            }
        }
        return totalAmount;
    }
    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItems += cartItems[item];
            }
        }
        return totalItems;
    }

    const contextValue = { getTotalCartItems,getTotalCartAmount,all_product, cartItems, addToCart, removeFromCart };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;

