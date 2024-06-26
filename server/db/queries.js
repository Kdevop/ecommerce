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
        const products = await pool.query(`SELECT * FROM ${this.schema.name}`);
        return products.rows;
    }

    async getFromSchemaByCategory() {
        const products = await pool.query(`SELECT * FROM ${this.schema.name} WHERE category = '${this.schema.category}'`);
        if (!products.rows[0]) return { error: true, message: 'Please ender a valid category' };
        return { error: false, products };
    }

    async getFromSchemaByName() {
        const products = await pool.query(`SELECT * FROM ${this.schema.name} WHERE name = '${this.schema.product}'`);
        return products;
    }

    async userDetails() {
        try {
            const userDetails = await pool.query('SELECT * FROM user WHERE id = ?', [this.schema.userConf]);
            if (userDetails.rows.length === 0) {
                res.status(404).json({ message: 'User not found!' });
            } else {
                res.json(result.row[0]);
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateUserDetails(userDetails) {
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
            return res.status(400).json({ error: 'Nothing to update' });
        } else {
            try {
                await pool.query(`UPDATE user SET ${setClause} WHERE id = $${fields.length + 1}`, [...values, userId]);
                res.status(200).json({ message: 'Details updated' });
            } catch {
                res.status(400).json({ error: err.message });
            }
        }
    }
}

module.exports = Queries;

