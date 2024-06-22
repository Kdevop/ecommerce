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
            return { error: true, errorMessage: "All fields are required" };
        }
                    
        try {
            const user = await pool.query(
                `INSERT INTO "user" ("Password", "Email", "first_name", "last_name") VALUES($1, $2, $3, $4) RETURNING "id"`,
                [hashedPassword, email, firstName, lastName]
            );
            return { error: false, data: user.rows[0] };
        } catch (err) {
            return { error: true, errorMessage: "A problem occurred. Please try a different username and/or password" };
        }
    }

    async getAllFromScheme() {
        const products = await pool.query (`SELECT * FROM ${this.schema.name}`);
        return products.rows;
    }

    async getFromSchemaByCategory() {
        const products = await pool.query(`SELECT * FROM ${this.schema.name} WHERE category = '${this.schema.category}'`);
        if(!products.rows[0]) return {error: true, message: 'Please ender a valid category'};
        return {error: false, products};
    }

    async getFromSchemaByName(){
        const products = await pool.query(`SELECT * FROM ${this.schema.name} WHERE name = '${this.schema.product}'`);
        return products;
    }
}

module.exports = Queries;