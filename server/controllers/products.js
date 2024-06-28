const Queries = require('../db/queries');

const querySchema = {name: 'products', category: '', products: ''};
const productsQueries = new Queries(querySchema);

const getAllProducts = async (req, res) => {
    try{
        const products = await productsQueries.getAllFromSchema();
        if (products.error) {
            throw new Error (products.message);
        }
        else {
            res.status(200).json({success: true, message: 'Products returned', data: products.data})
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const reqCategory = req.params.category;
        if (!reqCategory) {
            return res.status(400).json({ success: false, message: 'Category is required' });
        }

        const updatedQuerySchema = { ...productsQueries.querySchema, category: reqCategory }
        const result = await productsQueries.getFromSchemaByCategory(updatedQuerySchema);

        if (result.error) {
            return res.status(400).json({ success: false, message: result.message });
        } 
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'No products by that name'});
        } else {
            res.status(200).json({success: true, message: 'Products returned by category', data: result.data});
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProductByName = async (req, res) => {
    try{
        const updatedQuerySchema = { ...productsQueries.querySchema, products: req.params.name };
        const result = await productsQueries.getFromSchemaByName(updatedQuerySchema);
        if (result.error) {
            return res.status(400).json({ success: false, message: result.message });
        } if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'No products by that name'});
        } else {
            return res.status(200).json({ success: true, message: 'Products returned by name', data: result.data})
            //data => res.send(data.rows[0]))
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    getAllProducts,
    getProductsByCategory,
    getProductByName
};