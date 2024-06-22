const express = require('express');
const {getAllProducts, getProductsByCategory, getProductByName} = require('../controllers/products');
// controlers to be imported for CRUD below is just the API end point

const productRouter = express.Router();
productRouter.get('/', getAllProducts) //crud for fetching all products to be added.
// end point for fetching based on category
productRouter.get('/:category', getProductsByCategory); // crud operation to be added
// end point for product based on name
productRouter.get('/name:id', getProductByName); //crud operation to be added based on name

module.exports = {
    productRouter
};

