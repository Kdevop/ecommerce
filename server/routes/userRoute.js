const express = require('express');
const {registerUser} = require('../controllers/user')
// controlers to be imported for CRUD below is just the API end point

// end point for login
const signinRouter = express.Router();
signinRouter.post('/', ); //crud operation to be added for login

// end point for logout;
const logoutRouter = express.Router();
logoutRouter.post('/', ); //crud operation to be added for logout

// end point for register
const registerRouter = express.Router();
registerRouter.post('/', registerUser); //crud operation to be added for logout

const orderRouter = express.Router();
//end point for user pruchase history
orderRouter.get('/', );
// end point for details on a spefic order
orderRouter.get(`/:orderId`, );

const userRouter = express.Router();
//end point for user details
userRouter.get(`/:userId`, );
//end point for updating user details
userRouter.put(`/:userId`, );

module.exports = {
    signinRouter,
    logoutRouter,
    registerRouter,
    orderRouter,
    userRouter,
};