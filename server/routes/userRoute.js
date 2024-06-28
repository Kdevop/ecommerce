const express = require('express');
const {registerUser, getUserDetails, updateUser, userOrders, orderDetails} = require('../controllers/user')
const passport = require('passport');
// controlers to be imported for CRUD below is just the API end point

// end point for signin
const signinRouter = express.Router();
signinRouter.post('/',
    passport.authenticate('local', { failureRedirect: '/api/users/signin' }),
    (req, res) => {
        res.status(200).redirect('../');
    }
);

//below is slightly different syntaX, KEEPING FOR REFERNCE UNTIL PRODUCT ABOUT TO GO LIVE
// signinRouter.post('/', )
// .post( passport.authenticate('local', {failureRedirect: '/api/users/signin'}),
//     (req, res) => {
//         res.status(200).redirect('../')
//     }
// ); 


// end point for logout;
const logoutRouter = express.Router();
logoutRouter.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }

            // Clear the cookie
            res.clearCookie('connect.sid', { path: '/' });

            res.status(200).json({ message: 'Logged out' });
        });
    });
}); 

// end point for register
const registerRouter = express.Router();
registerRouter.post('/', registerUser); //crud operation to be added for logout

const orderRouter = express.Router();
//end point for user pruchase history
orderRouter.get('/:userId', userOrders);
// end point for details on a spefic order
orderRouter.get(`/:orderId`, orderDetails);

const userRouter = express.Router();
//end point for user details
userRouter.get(`/:userId`, getUserDetails);
//end point for updating user details
userRouter.put(`/:userId`, updateUser);


module.exports = {
    signinRouter,
    logoutRouter,
    registerRouter,
    orderRouter,
    userRouter,
};