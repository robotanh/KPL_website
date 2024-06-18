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

app.get('/api/hist_data', (req, res) => {
    const { id_voi, start_time, end_time, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT id_voi, ma_lan_bom, thoi_gian, gia_ban, tong_da_bom, tien_ban FROM gaspump_hist WHERE 1=1';
    const params = [];

    if (id_voi) {
        query += ' AND id_voi = ?';
        params.push(id_voi);
    }

    if (start_time) {
        query += ' AND thoi_gian >= ?';
        params.push(start_time);
    }

    if (end_time) {
        query += ' AND thoi_gian <= ?';
        params.push(end_time);
    }

    query += ' ORDER BY thoi_gian ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});


// Serve index.html for client-side routing, except for API routes
app.get('*', (req, res) => {
    const apiRoutes = ['/api/hist_data'];
    if (!apiRoutes.includes(req.path)) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        res.status(404).send('Not Found');
    }
});







app.listen(3000);
