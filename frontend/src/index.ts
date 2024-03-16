import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import Lobby from './scenes/Lobby'
import {W3SSdk} from '@circle-fin/w3s-pw-web-sdk'
import $ from 'jquery';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';


let encryptionKey: string;
let userToken: string;
let challengeId: string;
let appId: string;
const uuid: string = uuidv4();
const blockchains = ['ETH-SEPOLIA', 'MATIC-MUMBAI'];
const baseUrl = 'https://eth-global-game-2024-production.up.railway.app/';
const userId = '2f1dcb5e-312a-4b15-8240-abeffc0e3463';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + import.meta.env.VITE_CIRCLE_API_KEY
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + import.meta.env.VITE_CIRCLE_API_KEY,
    }
};

new Phaser.Game(
    Object.assign(config, {
        scene: [Lobby, GameScene,]
    })
);


$(document).ready(function () {

    function createWallet() {
        const sdk = new W3SSdk()

        sdk.setAppSettings({
            appId: appId,
        })

        sdk.setAuthentication({
            userToken: userToken,
            encryptionKey: encryptionKey,
        })


        sdk.execute($('#challengeId').val(), (error, result) => {
            if (error) {
                console.log(
                    `${error?.code?.toString() || 'Unknown code'}: ${
                        error?.message ?? 'Error!'
                    }`
                )

                return
            }

            console.log(`Challenge: ${result.type}`)
            console.log(`status: ${result.status}`)

            if (result.data) {
                console.log(`signature: ${result.data?.signature}`)
            }
        })
    }

    function createUser() {

        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/users',
            headers: {'Content-Type': 'application/json'},
            data: {userId: userId}
        };

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    function initialiseUser() {
        console.log('initialising')
        console.log('user tken is ', userToken)
        const options = {
            method: 'POST',
            url: baseUrl + '/initialise',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + import.meta.env.VITE_CIRCLE_API_KEY,
            },
            data: {idempotencyKey: uuid, blockchains: blockchains, userToken: userToken}
        };

        axios
            .request(options)
            .then(function (response) {
                challengeId = response.data.data.challengeId;
                if (appId && userToken && encryptionKey) {
                    console.log('creating wallet')
                    createWallet();
                }

            })
            .catch(function (error) {
                console.error(error)
                console.error(error.response);
            });

    }

    function initialiseUserFrontend() {


        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/user/initialize',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + import.meta.env.VITE_CIRCLE_API_KEY,
                'X-User-Token': userToken,
            },
            data: {idempotencyKey: uuid, blockchains: blockchains}
        };

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error.response.data);
            });

    }

    async function getSessionToken() {


        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/users/token',
            data: {userId: userId}
        };

        axios
            .request(options)
            .then(function (response) {
                console.log('res data is ' + response.data)
                userToken = response.data.data.userToken;

                encryptionKey = response.data.data.encryptionKey;
                initialiseUser()
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    function getAppId() {

        const url = 'https://api.circle.com/v1/w3s/config/entity';


        axios.get(url, axiosConfig)
            .then(response => {
                console.log('app id', response.data.data.appId)
                appId = response.data.data.appId
                getSessionToken();

            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    function getUser() {

        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/user/initialize',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': userId,
            },
            data: {idempotencyKey: '<IDEMPOTENCY_KEY>', blockchains: '[<BLOCKCHAIN>]'}
        };

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    $(function () {
        // $('#verifyButton').click(createWallet())
        $('#getUser').click(initialiseUser())
    })

    getAppId();
})