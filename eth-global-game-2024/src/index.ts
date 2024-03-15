import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import Lobby from './scenes/Lobby'
import {W3SSdk} from '@circle-fin/w3s-pw-web-sdk'
import $ from 'jquery';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';


let encryptionKey:string;
let userToken:string;
const uuid:string = uuidv4();
const blockchains = ['ETH-SEPOLIA', 'MATIC-MUMBAI']

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

const userId = '2f1dcb5e-312a-4b15-8240-abeffc0e3463'

$(document).ready(function () {
    function onSubmit() {
        const sdk = new W3SSdk()

        sdk.setAppSettings({
            appId: $('#appId').val(),
        })
        sdk.setAuthentication({
            userToken: $('#userToken').val(),
            encryptionKey: $('#encryptionKey').val(),
        })


        // If you want to customize the UI, you can uncomment & use the following code.
        // sdk.setLocalizations({
        //   common: {
        //     continue: 'Next',
        //   },
        //   securityIntros: {
        //     headline:
        //       'Set up your {{method}} to recover your pin code if you forget it',
        //     headline2: 'Security Question',
        //   },
        // })

        // sdk.setThemeColor({
        //   backdrop: '#fcba03',
        //   backdropOpacity: 0.8,
        //   textMain: '#2403fc',
        // })

        // sdk.setResources({
        //   naviClose:
        //     'https://static.vecteezy.com/system/resources/previews/018/887/462/non_2x/signs-close-icon-png.png',
        //   securityIntroMain:
        //     'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-560w,f_auto,q_auto:best/rockcms/2022-01/210602-doge-meme-nft-mb-1715-8afb7e.jpg',
        //   fontFamily: {
        //     name: 'Edu TAS Beginner',
        //     url: 'https://fonts.googleapis.com/css2?family=Edu+TAS+Beginner:wght@400;500;600;700&display=swap',
        //   },
        // })

        // sdk.setCustomSecurityQuestions(
        //   [
        //     {
        //       question: 'What is your favorite color?',
        //       type: 'TEXT',
        //     },
        //     {
        //       question: 'What is your favorite food?',
        //       type: 'TEXT',
        //     },
        //     {
        //       question: 'When is your birthday?',
        //       type: 'DATE',
        //     },
        //   ],
        //   1
        // )

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
        console.log('user token is', userToken)

        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/user/initialize',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': userToken,
            },
            data: {idempotencyKey: uuid, blockchains: blockchains}
        };
        console.log('user initialising:')
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
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
                console.log(response.data)
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
                'X-User-Token': '<USER_TOKEN>'
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
        $('#verifyButton').click(onSubmit)
        $('#getUser').click(getUser)
    })

    getAppId();
})