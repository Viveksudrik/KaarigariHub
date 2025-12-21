//import express
require('dotenv').config();
const express = require('express');
const cors = require('cors');



//initialize express app


const app = express();
const port = process.env.PORT || 5000;



//import router
const UserRouter = require('./routers/userRouter');
const ProductRouter = require('./routers/productRouter');
const ContactRouter = require('./routers/contactRouter');
const UtilRouter = require('./routers/util');
const OrderRouter = require('./routers/orderRouter');

//middleware to convert jason data to javascript object
app.use(cors({
    origin: '*' // Allow all origins for Vercel deployment
}))


app.use(express.json());

// middlewares 
app.use('/user', UserRouter);
app.use('/product', ProductRouter);
app.use('/contact', ContactRouter);
app.use('/util', UtilRouter);
app.use('/order', OrderRouter);
app.use('/review', require('./routers/reviewRouter'));

app.use(express.static('./uploads'));

//creating routes
app.get('/', (req, res) => {
    res.send('response from express server')
});

// /home
app.get('/home', (req, res) => {
    res.send('response from Home server')
});

// / add
app.get('/app', (req, res) => {
    res.send('response from Add server')
});


//starting server
//starting server
if (require.main === module) {
    app.listen(port, () => {
        console.log('express server started sucessfully')
    });
}

module.exports = app;

