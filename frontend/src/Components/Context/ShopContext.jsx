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

        const fetchCartItems = async () => {
            try {
                if (localStorage.getItem('cartItems')) {
                    // If there are cart items in localStorage, use them
                    setCartItems(JSON.parse(localStorage.getItem('cartItems')));
                }

                // Fetch cart items from the server
                if (localStorage.getItem('auth-token')) {
                    const response = await fetch('http://localhost:7000/getcart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': `${localStorage.getItem('auth-token')}`,
                            Accept: 'application/json',
                        },
                        body: "",
                    });

                    if (response.ok) {
                        const serverData = await response.json();
                        // Merge server data with localStorage data
                        setCartItems(prev => ({ ...prev, ...serverData }));
                    }
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [ ]);

    const getProductImage = (productId) => {
        // Find the product with the given ID
        const product = all_product.find((product) => product.id === productId);

        // Check if the product and its image property exist
        if (product && product.image) {
            return product.image; // Return the image property
        }

        // Return a default image or handle the case when image is not available
        return 'default-image.jpg';
    };
   
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

    const contextValue = { getProductImage ,getTotalCartItems,getTotalCartAmount,all_product, cartItems, addToCart, removeFromCart };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;

