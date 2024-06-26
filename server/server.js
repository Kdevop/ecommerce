//set up imports
const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require ('./controllers/auth.js')
const helmet = require('helmet');
const cors = require('cors');

//route imports
const { signinRouter, logoutRouter, registerRouter, orderRouter, userRouter } = require('./routes/userRoute');
const {productRouter} = require('./routes/productRoute');
const {cartRouter} = require('./routes/cartRoute');
const { DB, SS } = require('./config.js');

//server setup
const app = express();

app.use(cors());
app.use(helmet());
const mysqlStore = require('express-mysql-session')(session);
const { PORT } = require('./config');
const port = PORT || 3001;
const IN_PROD = SS.SS_NODE_ENV === 'production';

const options = {
    user: DB.DB_USER,
    host: DB.DB_HOST,
    database: DB.DB_DATABASE,
    password: DB.DB_PASSWORD,
    port: DB.DB_PORT,
    createDatabaseTable: true,
}

const sessionStore = new mysqlStore(options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,}));
app.use(session({
    name: SS.SS_SESS_NAME,
    resave: false,
    saveUninitialized: false, 
    store: sessionStore,
    secret: SS.SS_SESS_SECRET,
    cookie: {
        maxAge: SS.SS_SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);


//route for users
app.use('/api/users/signin', signinRouter);
app.use('/api/users/logout', logoutRouter);
app.use('/api/users/orders', orderRouter);
app.use('/api/users', userRouter)
app.use('/api/users/register', registerRouter);

// route for products
app.use('/api/products', productRouter); 

// route for cart
app.use('/api/cart', cartRouter); 


app.listen(port, () => {
    console.log(`Your server is listening on port ${port}`);
});

