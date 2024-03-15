import Phaser from 'phaser';
import {CST} from '../CST.js';
import getAtlas from '../utils/getAtlas';

export default class Demo extends Phaser.Scene {
    constructor() {
        super({key: CST.SCENES.LOBBY});
    }

    preload() {
        this.load.spritesheet('frog', 'Main Characters/Ninja Frog/Idle (32x32).png', {frameHeight: 32, frameWidth: 32})
        this.load.spritesheet('frogwalk', 'Main Characters/Ninja Frog/Run (32x32).png', {
            frameHeight: 32,
            frameWidth: 32
        })


    }

    create() {
        this.anims.create({
            key: "idle",
            frameRate: 10,
            frames: this.anims.generateFrameNames('frog', {frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
            repeat: -1,
        })

        this.anims.create({
            key: "walk",
            frameRate: 10,
            frames: this.anims.generateFrameNames("frogwalk", {frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
            repeat: -1,
        })

        this.player = this.add.sprite(100, 100, 'frog');
        this.player.anims.play('idle');


        const button = this.add.text(400, 200, 'Go to Next Scene', {
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: 10
        }).setInteractive();

        button.on('pointerdown', () => {
            this.scene.start('NextScene'); // Replace 'NextScene' with the name of your next scene
        });

    }

    update() {
        const moveAmount = 2;
        const player = this.player;

        function left() {
            player.x = player.x - moveAmount
            player.anims.play('walk', true);
        }

        function right() {
            player.anims.play('walk', true);
            player.x = player.x + moveAmount
        }

        const cursors = this.input.keyboard.createCursorKeys();

        // Keyboard input event listeners
        if (cursors.left.isDown) {
            left()
        } else if (cursors.right.isDown) {
            // player.setVelocityX(160);
            right()

        } else {
            // player.setVelocityX(0);

            this.player.anims.play('idle');
        }
    }
}
