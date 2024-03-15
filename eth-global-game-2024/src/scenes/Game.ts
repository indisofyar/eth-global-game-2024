import Phaser from 'phaser';
import {CST} from "../CST";

export default class Demo extends Phaser.Scene {
    constructor() {
        super('GameScene');

    }

    preload() {
        this.load.image('bg', 'Background/blue.png');
        this.load.image('m', 'Main Characters/Ninja Frog/Idle (32x32).png');
    }

    create() {
        const {width, height} = this.game.config;

        const background = this.add.tileSprite(0, 0, width, height, 'bg');
        background.setOrigin(0, 0); // Set origin to top-left
        background.setTileScale(width / background.width, height / background.height);

        const button = this.add.text(400, 200, 'Go to Next Scene', {
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: 10
        }).setInteractive();

        button.on('pointerdown', () => {
            this.scene.start(CST.SCENES.LOBBY); // Replace 'NextScene' with the name of your next scene
        });


        this.add.image(0,0, "m")
    }
}
