// backend\index.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World');
})
// connecting to the database
mongoose.connect('mongodb+srv://Zakaria:7702967@cluster0.k6biztn.mongodb.net/e-commerce');
// creating storage for uploading images
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})
//creating upload endpoint for images
const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    });
});
// schema for creating product
const productSchema = mongoose.model('Product', {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    availabel: {
        type: Boolean,
        default: true
    }
})
// creating endpoint for adding products
app.post('/addproduct', async (req, res) => {
    let id;

    if (req.body.id) {
        // Use the provided id if available
        id = req.body.id;
    } else {
        // Generate the next id if not provided
        let products = await productSchema.find({});
        if (products.length > 0) {
            let lastProduct = products[products.length - 1];
            id = lastProduct.id + 1;
        } else {
            id = 1;
        }
    }

    const product = new productSchema({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price
    });

    console.log(product);

    try {
        await product.save();
        console.log('Product Added');
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// creating get all products endpoint
app.get('/allproducts', async (req, res) => {
    let products = await productSchema.find({});
    console.log('all products fetched');
    res.send(products);

})
// creating update product endpoint
app.post('/updateproduct', async (req, res) => {
    const productId = req.body.id;

    try {
        const updatedProduct = await productSchema.findOneAndUpdate(
            { id: productId },
            {
                $set: {
                    name: req.body.name,
                    image: req.body.image,
                    category: req.body.category,
                    new_price: req.body.new_price,
                    old_price: req.body.old_price,
                },
            },
            { new: true }
        );

        if (!updatedProduct) {
            console.error(`Product with ID ${productId} not found`);
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        console.log('Product Updated');
        res.json({
            success: true,
            updatedProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// creating delete product endpoint 
app.post('/removeproduct', async (req, res) => {
    await productSchema.findOneAndDelete({ id: req.body.id });
    console.log('Product Removed');
    res.json({
        success: true,
        name: req.body.name,
    })
})
//creating user schema
const userSchema = mongoose.model('Users', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})
// function to generate JWT token for authentication 
const generateJWTToken = (userId) => {
    const data = {
      user: {
        id: userId,
      },
    };
  
    return jwt.sign(data, 'mysecretkey');
  };

app.post('/signup', async (req, res) => {

    let check = await userSchema.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, error: 'This Email ID is already exists' });
    }

    // Convert the password to a string before hashing
    const passwordString = String(req.body.password);

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(passwordString, 10);

    let Cart = {};
    for (let i = 0; i < 50; i++) {
        Cart[i] = 0;
    }

    const user = new userSchema({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        cartData: Cart
    });

    await user.save();
    console.log('User Added');

    const data = {
        user: {
            id: user.id,
        }
    }
    const token = jwt.sign(data, 'mysecretkey');
    res.json({ success: true, token });
});
// creating endpoints for login
app.post('/login', async (req, res) => {
    try {
        let user = await userSchema.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid email ID' });
        }

        // Convert the provided password to a string before comparing
        const providedPasswordString = String(req.body.password);

        // Compare hashed passwords using bcrypt
        const passwordMatch = await bcrypt.compare(providedPasswordString, user.password);

        if (passwordMatch) {
            const { _id, name } = user;
    
            // Generate and send back a JWT token for authentication
            const Token = generateJWTToken(_id); // Updated this line
    
            // Send back user information along with the token
            res.json({ success: true, Token, user: { _id, name } });
        } else {
            return res.status(400).json({ success: false, error: 'Wrong password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// Creating a forget password endpoint
app.post('/forgetpassword', async (req, res) => {
    try {
        let user = await userSchema.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid email id' });
        }

        const token = jwt.sign({ _id: user._id }, 'mysecretkey');
        const resetLink = `http://localhost:3000/resetpassword/${user._id}/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rabadaanmahad@gmail.com',
                pass: 'eyou phzg luab kjxf'
            }
        });

        const mailOptions = {
            from: 'rabadaanmahad@gmail.com',
            to: req.body.email,
            subject: 'Reset Password',
            html: `<p>Click the following link to reset your password:</p>
                   <p><a href="${resetLink}">${resetLink}</a></p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, error: 'Failed to send reset password email' });
            }
            console.log('Reset password email sent:', info.response);
            res.json({ success: true, message: 'Password reset link sent to your email' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// Creating a reset password endpoint
app.post('/resetpassword/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const user = await userSchema.findById(id);
    if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid user id' });
    }
    jwt.verify(token, 'mysecretkey', async (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: 'Invalid token' });
        }
        const newPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        try {
            user.password = hashedPassword;
            await user.save();
            console.log('Password updated successfully');
            res.json({ success: true, message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: ' user not found' });
        }
    });
});
// creating get all users endpoint and hide the cartData from the response
app.get('/users', async (req, res) => {
    const users = await userSchema.find({}, { cartData: 0 });
    res.json({ success: true, users });

});
// creating get user endpoint and hide the cartData,email, password and the _id from the response
app.get('/getuser/:id', generateJWTToken,  async (req, res) => {
    try {
        // please hide the cartData,email, password and the _id from the response
        const user = await userSchema.findById(req.params.id).select('-cartData -email -password -_id -date -__v');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})
// creating middleware for fetchuser 
  const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
      res.status(401).send({ error: 'Please authenticate using a valid token' });
    }
    try {
      const data = jwt.verify(token, 'mysecretkey');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ error: 'Please authenticate using a valid token' });
    }
  }
// creating endpoint for adding products  to cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log('Adding to cart', req.body.itemId)
   let userData = await userSchema.findOne({ _id: req.user.id });
   userData.cartData[req.body.itemId] += 1;
   await userSchema.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
   res.json({ success: true, message: 'Product added to cart' });
})
// creating endpont for removing product from cartdata
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log('Removing from cart' , req.body.itemId)
    let userData = await userSchema.findOne({ _id: req.user.id });
    if( userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
    await userSchema.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.json({ success: true, message: 'Product removed from cart' });
})
// // creating endpoint to get cart data
app.post('/getcart', fetchUser, async (req, res) => {
    console.log('Getting cart data')
    const userData = await userSchema.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})
const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})