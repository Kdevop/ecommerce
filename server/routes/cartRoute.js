const express = require('express');
// controlers to be imported for CRUD below is just the API end point
const { openCart, getFromCart, addToCart, updateCart, deleteItem } = require('../controllers/cart');

const cartRouter = express.Router();

//end point for getting details from a customer cart
cartRouter.get('/', getFromCart); 
// end point for opening a cart.
cartRouter.post('/open', openCart) 
//end point for adding product to cart
cartRouter.put('/item/', addToCart); //crud operation to be added for updating card
cartRouter.put('/item/:cartId', updateCart)
//end point for deleting from card
cartRouter.delete('/item/:productId', deleteItem); //curd operation to be added for deleting from cart
//end point for check out
cartRouter.post(`/:cartId/checkout`, ); //crud operation for checkout to be added

module.exports = {
    cartRouter
};
