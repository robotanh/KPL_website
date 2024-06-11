// Router.cjs
const bcrypt = require('bcrypt');

class Router {
    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
    }

    login(app, db) {
        app.post('/login', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();

            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: 'An error occurred, please try again'
                });
                return;
            }

            let cols = [username];
            db.query('SELECT * FROM users WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occurred, please try again'
                    });
                    return;
                }
                if (data && data.length === 1) {
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
                        if (verified) {
                            req.session.userID = data[0].id;
                            res.json({
                                success: true,
                                username: data[0].username,
                                redirectUrl: '/app'  // Add the redirect URL here
                            });
                            return;
                        } else {
                            res.json({
                                success: false,
                                msg: 'Invalid password'
                            });
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        msg: 'User not found, please try again'
                    });
                }
            });
        });
    }

    logout(app, db) {
        app.post('/logout', (req, res) => {
            if (req.session.userID) {
                req.session.destroy((err) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'Logout failed'
                        });
                        console.log(err);
                        return;
                    }
                    res.clearCookie('ryhfvgf79guohfqbifewufiberof'); // Clear the session cookie
                    res.json({
                        success: true
                    });
                });
            } else {
                res.json({
                    success: false,
                    msg: 'No session found'
                });
            }
        });
    }

    isLoggedIn(app, db) {
        app.post('/isLoggedIn', (req, res) => {
            if (req.session.userID) {
                let cols = [req.session.userID];
                db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {
                    if (data && data.length === 1) {
                        res.json({
                            success: true,
                            username: data[0].username
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                });
            } else {
                res.json({
                    success: false
                });
            }
        });
    }
}

module.exports = Router;
