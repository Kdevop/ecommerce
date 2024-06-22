const Pool = require('pg').Pool;
const { DB } = require('../config');

const pool = new Pool({
    user: DB.DB_USER,
    host: DB.DB_HOST,
    database: DB.DB_DATABASE,
    password: DB.DB_PASSWORD,
    port: DB.DB_PORT
})

export const query = (text, params ) => pool.query(text, params);


// You can replace the line above with the below when the time comes to check 
// all the queries that go to the databse
// export const query = async (text, params) => {
//     const start = Date.now()
//     const res = await pool.query(text, params)
//     const duration = Date.now() - start
//     console.log('executed query', { text, duration, rows: res.rowCount })
//     return res
//   }
