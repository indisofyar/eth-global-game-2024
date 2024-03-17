var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fetch = require('node-fetch'); // Import fetch
const {v4: uuidv4} = require('uuid'); // Import uuidv4
const cors = require('cors'); // Import cor
const {Network, Alchemy} = require("alchemy-sdk");
require('dotenv').config()


var app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Enable CORS for all routes


// Listen to requests
app.listen(4000, function () {
    console.log('Server is listening on port 4000');
});

app.options('/initialise', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

app.get('/', function (req, res) {
    res.send('Welcome to server')
})

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

app.post('/create-wallet', function (req, res, next) {

    console.log('key ', process.env.CIRCLE_API_KEY, 'token', req.body.userToken)
    console.log('req data is')
    console.log(req.body); // Access request body with req.body
    console.log('process env', process.env);
    const userToken = req.body.userToken.replace(' ', '')
    console.log('user token is ', userToken)
    const url = 'https://api.circle.com/v1/w3s/user/wallets';
    const uuid = uuidv4()
    console.log('uuid', uuid)
    const options = {
        method: 'POST',
        'X-User-Token': userToken,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + process.env.CIRCLE_API_KEY,
        },
        body: JSON.stringify({
            idempotencyKey: uuid,
            blockchains: ['ETH-GOERLI', 'ETH-SEPOLIA'],
            metadata: [{name: 'Wallet', refId: 'wallet123'}],
            accountType: 'EOA'
        })
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

app.get('/wallet-status/:walletId', function (req, res, next) {
    const fetch = require('node-fetch');

    const url = 'https://api.circle.com/v1/w3s/wallets/' + 'de9a9d47-cb00-537f-8e74-605aeb8f753f';
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.CIRCLE_API_KEY}
    };

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

app.get('/wallet-bal/:walletId', function (req, res, next) {
    const fetch = require('node-fetch');

    const url = 'https://api.circle.com/v1/w3s/wallets/' + 'de9a9d47-cb00-537f-8e74-605aeb8f753f' + '/balances';
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.CIRCLE_API_KEY}
    };

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

app.get('/list-users', function (req, res, next) {
    const fetch = require('node-fetch');

    const url = 'https://api.circle.com/v1/w3s/users'

    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.CIRCLE_API_KEY}
    };

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

app.get('/list-wallets', function (req, res, next) {
    const fetch = require('node-fetch');

    const url = 'https://api.circle.com/v1/w3s/wallets'

    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.CIRCLE_API_KEY}
    };

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

app.get('/get-nfts', async function (req, res, next) {


// Optional Config object, but defaults to demo api-key and eth-mainnet.
    console.log('api key is ', process.env.ALCHEMY_API_KEY)
    const settings = {
        apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
        network: Network.ETH_MAINNET, // Replace with your network.
    };

    const alchemy = new Alchemy(settings);

    const marketplaces = ['seaport', 'looksrare', 'x2y2', 'wyvern', 'blur', 'cryptopunks']
    const randomMarketPlaceIndex = () => Math.floor(Math.random() * ((marketplaces.length - 1) - 0) + 0);

    async function getBlock() {
        console.log('getting block')
        const latestBlock = await alchemy.nft.getNftSales({marketplace: marketplaces[randomMarketPlaceIndex()]});

        return latestBlock;
    }

    // const address = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

    async function getNftsForAddress(address) {


        // Flag to omit metadata
        const omitMetadata = false;

        // Get all NFTs
        const {nfts} = await alchemy.nft.getNftsForContract(address, {
            omitMetadata: omitMetadata,
        });

        return nfts
    }

    let response = await getBlock();
    let arr = []
    let blocks = response.nftSales

    const max = blocks.length
    const min = 1
    let randomBlockIndex = () => Math.floor(Math.random() * (max - min) + min);
    const nftLimit = 12

    console.log(blocks)
    // From blocks we get a random address, this lets us view different NFTs every time
    for(let i = 0; i < nftLimit; i++){
        const currBlock = blocks[randomBlockIndex()]
        console.log('curr block is ', currBlock)
        arr.push(currBlock.contractAddress)
    }

    // console.log(arr)

    let newRes = await getNftsForAddress(arr[0]);
    // console.log(newRes)

    // Get a random collection address from the response


    res.send(JSON.stringify(newRes))
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
module.exports = app;
