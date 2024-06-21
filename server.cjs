const express = require('express');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require("./Router.cjs");
const cors = require('cors');
const fs = require('fs');
const { parse } = require('json2csv');
const XLSX = require('xlsx');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());

// Database
const db = mysql.createConnection({
    host: '171.232.94.83',
    user: 'remote_user',
    password: 'remote_user',
    database: 'KPL_Gaspump_DB'
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
    }
}));

new Router(app, db);

// Authentication middleware
function checkAuth(req, res, next) {
    if (req.session.userID) {
        next();
    } else {
        res.redirect('/');
    }
}

// Protect /app and /app/* routes
app.use('/app', checkAuth);
app.use('/app/*', checkAuth);

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

app.get('/api/export', (req, res) => {
    const { id_voi, start_time, end_time, format } = req.query;
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

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Internal Server Error');
        } else {
            if (format === 'csv') {
                const csv = parse(results);
                res.header('Content-Type', 'text/csv');
                res.attachment('data.csv');
                res.send(csv);
            } else if (format === 'xlsx') {
                // Format dates explicitly
                const formattedResults = results.map(row => ({
                    ...row,
                    thoi_gian: new Date(row.thoi_gian).toLocaleString('en-GB')
                }));
                
                const ws = XLSX.utils.json_to_sheet(formattedResults, { dateNF: 'dd/mm/yyyy hh:mm:ss' });
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                const filePath = path.join(__dirname, 'data.xlsx');
                XLSX.writeFile(wb, filePath);
                res.download(filePath, 'data.xlsx', (err) => {
                    if (err) {
                        console.error('Error downloading file:', err);
                    }
                    fs.unlinkSync(filePath);
                });
            } else {
                res.status(400).send('Invalid format');
            }
        }
    });
});

// Serve index.html for client-side routing, except for API routes
app.get('*', (req, res) => {
    const apiRoutes = ['/api/hist_data', '/api/export'];
    if (!apiRoutes.includes(req.path)) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        res.status(404).send('Not Found');
    }
});

app.listen(3000);
