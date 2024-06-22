const bcrypt = require('bcrypt');
const Queries = require('../db/queries');

const querySchema = {name: 'register', userDetails: ''};
const registerQueries = new Queries(querySchema);

const registerUser = async (req, res) => {
    try {
        const {password, email, first_name, last_name} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userDetails = {hashedPassword, email, first_name, last_name};
        
        registerQueries.userDetails = userDetails;
        
        const data = await registerQueries.registerUser();
        
        if (!data.error) {
            req.session.user = data.data;
            req.session.authenticated = true;
            res.send('You are successfully registered!');
        } else {
            res.send(data.errorMessage);
        }
    } catch (error) {
        res.status(500).send('An error occurred during registration.');
    }
};

module.exports = {registerUser};