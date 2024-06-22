const Queries = require('../db/queries');

const querySchema = {name: 'products', category: '', products: ''};
const productsQueries = new Queries(querySchema);

const getAllProducts = (req, res) => {
    productsQueries.getAllFromSchema()
    .then(data => res.send(data));
};

const getProductsByCategory = (req, res) => {
    query.Schema.category = req.params.category;
    productsQueries.getFromSchemaByCategory()
    .then((data) => {
        if(data,error) return res.send(data.message);
        res.send(data.products.rows);
    });
};

const getProductByName = (req, res) => {
    querySchema.products = req.params.name;
    productsQueries.getFromSchemaByName()
    .then(data => res.send(data.rows[0]));
}

module.exports = {
    getAllProducts,
    getProductsByCategory,
    getProductByName
};