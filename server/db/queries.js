const pool = require('./index');
const bcrypt = require('bcrypt');

class Queries {
    constructor(schema) {
        this.schema = schema;
    }

    async registerUser() {
        const { hashedPassword, firstName, lastName, email } = this.schema.userDetails;

        // Input validation
        if (!hashedPassword || !firstName || !lastName || !email) {
            return { error: true, message: "All fields are required" };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { error: true, message: "Invalid email format" };
        }

        try {
            const user = await pool.query(
                `INSERT INTO "user" ("Password", "Email", "first_name", "last_name") VALUES($1, $2, $3, $4) RETURNING "id"`,
                [hashedPassword, email, firstName, lastName]
            );
            return { error: false, data: user.rows[0] };
        } catch (err) {
            return { error: true, message: "A problem occurred. Please try a different username and/or password" };
        }
    }

    async getAllFromSchema() {
        try {
            const query = `SELECT * FROM ${this.schema.name}`;
            const products = await pool.query(query);
            return { error: false, data: products.rows };
        } catch (error) {
            return { error: true, message: error.message }
        }
    }

    async getFromSchemaByCategory() {
        try {
            const query = `SELECT * FROM products WHERE category = $1`;
            const products = await pool.query(query, [this.schema.category]);

            return { error: false, data: products.rows };
        } catch (error) {
            console.error({ message: 'Error fetching products by category', error });
            return { error: true, message: 'An error occurred while fetching products. Please try again later.' };
        }
    }

    async getFromSchemaByName() {
        try {
            const query = `SELECT * FROM products WHERE name = $1`;
            const products = await pool.query(query, [this.schema.product])

            return { error: false, data: products.rows };

        } catch (error) {
            console.error({ message: 'Error fetching products by name', error });
            return { error: true, message: 'An error occured while fetching products. Please try again later' };
        }
    }

    async initCart() {
        try {
            const cartExistQuery = `SELECT * FROM carts WHERE customer_id = $1`;
            const cartExists = await pool.query(cartExistQuery, [this.schema.customerId]);

            if (cartExists.rows.length > 0) {
                return { error: false, exists: true, message: 'A cart has already been opened.' };
            } else {
                const newCartQuery = 'INSERT INTO carts (customer_id) VALUES ($1) RETURNING *';
                const newCart = await pool.query(newCartQuery, [this.schema.customerId]);
                return { error: false, exists: true, message: 'A cart has been opened', data: newCart.rows[0] };
            }
        } catch (error) {
            console.error({ message: 'Error contacting SQL to open cart', error });
            return { error: true, exists: false, message: 'Unable to open a new cart. Try block failed.' };
        }
    }

    async cartDetails() {
        try {
            const cartProdQuery = `SELECT * FROM carts 
                                    INNER JOIN cart_products
                                    ON carts.id = cart_products.cart_id
                                     WHERE customer_id = $1`;
            const cartProducts = await pool.query(cartProdQuery, [this.schema.customerId]);
            if (cartProducts.rows.length === 0) {
                return { error: false, message: 'There are no products in your cart.', data: cartProducts.rows };
            } else {
                return { error: false, message: 'Here are the products in your cart', data: cartProducts.rows };
            }
        } catch (error) {
            console.error({ message: 'Error in returning cart products', error });
            return { error: true, message: 'Unable to return your cart at the moment. Please try again later.' };
        }
    }

    async addProductToCart() {
        try {
            //get the cart if for the current user
            const cartQuery = `SELECT if FROM cart WHERE user_id = $1`;
            const cartResult = await pool.query(cartQuery, [this.schema.customerId]);

            if (cartResult.rows.length === 0) {
                return { error: true, message: 'User does not have a cart' };
            }

            const cartId = cartResult.rows[0].id;

            //insert product to table
            const insertQuery = 'INSERT INTO cart_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
            const insertResult = await pool.query(insertQuery, [cartId, this.schema.product, this.schema.quantity]);

            return { error: false, data: insertResult.rows };

        } catch (error) {
            console.error({ message: 'Error adding product to cart', error });
            return { error: true, message: 'Unable to add product to cart. Please try again later.' };
        }
    }

    async amendCart() {
        try {
            const cartQuery = `SELECT if FROM cart WHERE user_id = $1`;
            const cartResult = await pool.query(cartQuery, [this.schema.customerId]);

            const cartId = cartResult.rows[0].id;

            const updateQuery = 'UPDATE cart_products SET quantity = $1 WHERE cart_id = $2 RETURNING *';
            const updateResult = await pool.query(updateQuery, [this.schema.quantity, cartId]);

            return { error: false, data: updateResult.rows }

        } catch (error) {
            console.error({ message: 'Error adding product to cart', error });
            return { error: true, message: 'Unable to add product to cart. Please try again later.' };
        }
    }

    async removeFromCart() {
        try {
            const cartQuery = `SELECT id FROM cart WHERE user_id = $1`;
            const cartResult = await pool.query(cartQuery, [this.schema.customerId]);

            const cartId = cartResult.rows[0].id;

            const deleteQuery = 'DELETE FROM cart_products WHERE cart_id = $1 AND product_id = $2';
            const deleteResult = await pool.query(deleteQuery, [cartId, this.schema.products]);

            return { error: false, data: deleteResult.rows }
        } catch (error) {
            console.error({ message: 'Error deleting product from cart', error });
            return { error: true, message: 'Unable to delete product Failed at postgres.'};
        }
    }

    async checkoutCart() {
        try {
            const cartId = this.schema.cartId;
            const userId = this.schema.customerId;
            const paymentMethod = this.schema.paymentMethod;
    
            const fetchCart = await this.cartDetails(userId); // Assuming cartDetails is a method in the same class
    
            if (fetchCart.data.length === 0) {
                console.error({ message: 'There is nothing in your cart.' });
                return { error: true, message: 'Your cart is currently empty.' };
            } else {
                let totalPrice = 0;
                for (let item of fetchCart.data) {
                    totalPrice += item.quantity * item.product_price;
                }
    
                const date = new Date();
                const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
                const checkoutQuery = 'INSERT INTO checkout (payment_method, total_price, checkout_date, cart_id) VALUES ($1, $2, $3, $4) RETURNING *';
                const createCheckout = await pool.query(checkoutQuery, [paymentMethod, totalPrice, today, cartId]);
    
                if (!createCheckout) {
                    console.error({ message: 'Unable to create check out.' });
                    return { error: true, message: 'Unable to process checkout' };
                } else {
                    console.log('Return to front end to begin processing payment');
                    return { error: false, message: 'Checkout ready to be processed', data: createCheckout};
                }
            }
        } catch (error) {
            console.error('Unable to process at query!', error);
            return { error: true, message: 'Unable to process at query.' };
        }

        //details on processing payment to be added once I have a handle on the front, in addition, I will need to do an insert statement into orders, once complete. 
    }

    async customerDetails() {
        try {
            const userDetails = await pool.query('SELECT * FROM user WHERE id = $1', [this.schema.userConf]);
            if (userDetails.rows.length === 0) {
                return { error: true, message: 'User not found!' }
            } else {
                return { error: false, data: result.row[0] }
            }
        } catch (error) {
            console.error({ message: 'Error collecting customer details', error });
            return { error: true, message: error.message };
        }
    }

    //below might need some work re if the try block fails... I will test. 
    async ordersOverview(userId) {
        try {
            const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
            return { error: false, data: result.rows };
        } catch (error) {
            console.error({ message: 'Error collecting orders:', error });
            return { error: true, message: error.message };
        }
    }

    async orderIdDetails(orderId) {
        try {
            const result = await pool.query('SELECT * FROM orders INNER JOIN checkout ON orders.checkout_id = checkout.id WHERE orders.id = $1', [orderId]);
            return { error: false, data: result.rows[0] };
        } catch (error) {
            console.error({ message: 'Error collecting order details', error });
            return { error: true, message: error.message };
        }
    }

    async updateUserDetails(userDetails, res) {
        const { userId, email, password, firstName, lastName } = userDetails;

        const fields = [];
        const values = [];

        if (email) {
            fields.push('email');
            values.push(email);
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            fields.push('password');
            values.push(hash);
        }

        if (firstName) {
            fields.push('first_name');
            values.push(firstName);
        }

        if (lastName) {
            fields.push('last_name');
            values.push(lastName);
        }

        const setClause = fields.map((field, index) => `${field} = ${index + 1}`).join(', ');
        //console.log(setClause);
        //console.log(`UPDATE users SET ${setClause} WHERE id = $${fields.length + 1}`, [...values, userId]);
        if (fields.length === 0) {
            return { error: true, message: 'Nothing to update' }
        } else {
            try {
                await pool.query(`UPDATE user SET ${setClause} WHERE id = $${fields.length + 1}`, [...values, userId]);
                return { error: false, message: 'Details updated' };
            } catch (error) {
                return { error: true, mesaage: error.message }
            }
        }
    }
}

module.exports = Queries;

