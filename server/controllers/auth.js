const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { query } = require('../db/index');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const userResult = await query('SELECT * FROM user WHERE email = $1',
                    [email]
                );
                if (userResult.rows.length === 0) {
                    return done(null, false, { message: 'User not found' });
                }

                const user = userResult.rows[0];

                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, {
                        id: user.id,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name
                    });
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            } catch (err) {
                console.error('Error during authentication');
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const userResult = await query('SELECT id, email, first_name AS "firstName", last_name AS "lastName" FROM user WHERE id = $1',
                [id]
            );
            if (userResult.rows.length === 0) {
                return done(new Error('User not found'));
            } return done(null, userResult.rows[0].id);
        } catch (err) {
            done(err);
        }
    });
};


