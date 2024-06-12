const express = require('express');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require("./Router.cjs");
const cors = require('cors')


const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());

// Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'remote_user',
    password: 'remote_user',
    database: 'KPL_Gaspump_DB_test'
});

db.connect(function (err) {
    if (err) {
        console.log('DB error');
        throw err;
        return false;
    }
});

const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db);

app.use(session({
    key: 'ryhfvgf79guohfqbifewufiberof',
    secret: 'bg99uhbrjbkgpokvsdy7sayu',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
}}));

new Router(app, db);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    return res.json("From backend")
});


app.get('/app/hist_data', (req, res) => {
    const query = 'SELECT * FROM gaspump_hist';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});


app.listen(3000);
