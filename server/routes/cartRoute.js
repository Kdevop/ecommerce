const express = require('express');
// controlers to be imported for CRUD below is just the API end point

const cartRouter = express.Router();

//end point for opening card
cartRouter.get('/:userId', ); //crud operation for opening cart to be added
//end point for adding to cart
cartRouter.post(`/item/:cartId`, ); //crud operation for adding to card to be added
//end point for updating cart
cartRouter.put('/item/:cartId', ); //crud operation to be added for updating card
//end point for deleting from card
cartRouter.delete('/item/:cartId', ); //curd operation to be added for deleting from cart
//end point for check out
cartRouter.post(`/:cartId/checkout`, ); //crud operation for checkout to be added

module.exports = {
    cartRouter
};
