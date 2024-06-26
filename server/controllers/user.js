const bcrypt = require('bcrypt');
const Queries = require('../db/queries');

const querySchema = { name: 'register', userDetails: '' };
const registerQueries = new Queries(querySchema);
const userQueries = new Queries(querySchema)

const registerUser = async (req, res) => {
    try {
        const { password, email, first_name, last_name } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userDetails = { hashedPassword, email, first_name, last_name };

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

const getUserDetails = async (req, res) => {
    const { userId } = req.params;
    if (req.user == userId) {
        try {
            const userConf = userId;
            userQueries.userConf = userConf;

            const userData = await userQueries.userDetails();

            if (!userData.error) {
                // Do some stuff
                res.status(200).json(userData.rows[0]); // Assuming you want to send the user data back
            } else {
                res.status(400).json({ message: userData.errorMessage });
            }
        } catch (error) {
            console.error('Error collecting user details:', error)
             res.status(500).send({message:'An error occured collecting your details'});   
        }
    } else {
        res.status(400).json({message: 'Please login.'})
    }
}

const updateUser = async (req, res) => {
    const { userId } = req.params;
    
    if (req.user == userId) {
        try {
            const userDetails = { ...req.body, userId};
            const result = await userQueries.updateUserDetails(userDetails);
            res.status(200).json({ message: 'User details updated successfully', result });
        } catch (error) {
            console.error('Error updating user details:', error);
            res.status(500).json({ message: 'Error updating user details', error });
        }
    } else {
        res.status(400).json({message: 'Please login.'})
    }
}



module.exports = { 
    registerUser,
    getUserDetails,
    updateUser
  };