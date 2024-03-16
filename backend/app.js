var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fetch = require('node-fetch'); // Import fetch
const {v4: uuidv4} = require('uuid'); // Import uuidv4
const cors = require('cors'); // Import cors
require('dotenv').config()


var app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Enable CORS for all routes

//
// // Listen to requests
// app.listen(4000, function () {
//     console.log('Server is listening on port 4000');
// });

app.options('/initialise', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

app.get('/initialise', function (req, res) {
    res.send('hello')
})
// POST endpoint for /initialise
app.post('/initialise', function (req, res, next) {

    console.log('key ', process.env.CIRCLE_API_KEY, 'token', req.body.userToken)
    console.log('req data is')
    console.log(req.body); // Access request body with req.body
    console.log('process env', process.env);

    const url = 'https://api.circle.com/v1/w3s/user/initialize';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.CIRCLE_API_KEY,
            'X-User-Token': req.body.userToken, // Assuming circleApiKey is part of request body
        },
        body: JSON.stringify({idempotencyKey: uuidv4(), blockchains: ['ETH-SEPOLIA']})
    };

    console.log('fetching');
    fetch(url, options)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            res.send(json); // Send response back to the client
        })
        .catch(err => {
            console.error('error:', err);
            res.status(500).send('Internal Server Error'); // Handle error
        });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
module.exports = app;
