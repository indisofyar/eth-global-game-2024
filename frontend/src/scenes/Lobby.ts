import Phaser from 'phaser';
import {CST} from '../CST.js';
import getAtlas from '../utils/getAtlas';
// import {getRandomFilePath} from '../utils/getRandomFilePath'

const nousAmt = 150
const nftAmt = 80

export default class Demo extends Phaser.Scene {
    constructor() {
        super({key: CST.SCENES.LOBBY});
        this.player
        this.bg
        this.bg1
        this.bg2
        this.bg3
        this.nousImages
        this.nfts
        this.nftsLoaded
    }



    preload() {


        this.load.image('bg', 'nous_assets/0_Backgrounds/bg-cool.png')
        this.load.image('bg', 'nous_assets/0_Backgrounds/bg-warm.png')
        this.load.image('bg1', 'Background/1.png')
        this.load.image('bg2', 'Background/2.png')
        this.load.image('bg3', 'Background/3.png')
        this.load.image('bg4', 'Background/4.png')


        this.load.spritesheet('frog', 'Main Characters/Ninja Frog/Idle (32x32).png', {frameHeight: 32, frameWidth: 32})
        this.load.spritesheet('frogwalk', 'Main Characters/Ninja Frog/Run (32x32).png', {
            frameHeight: 32,
            frameWidth: 32
        })
        this.load.image('floor', 'Background/floor.png');

        const max = 1
        const min = 274
        let randomHead = () => Math.floor(Math.random() * (max - min) + min);

        let i = 0
        while (i < nousAmt) {
            this.load.image('nous' + i, 'nous_assets/1_Heads/head-' + randomHead() + '.png');
            i++;
        }
        this.load.audio('music', ['music/techno-short.mp3']);


    }

    create() {
        this.power = 0;
        this.sound.add('music').play()

        const {width, height} = this.game.config;

        const inputWidth = width * 4;
        const inputHeight = height * 9;
        this.bgbg = this.add.image(0, 0, "bg1",)

        this.bgbg.setScale(50)
        this.bg = this.add.image(0, 0, "bg1",)
        this.bg.setScale(5)
        this.bg1 = this.add.image(400, 200, "bg2",)
        this.bg1.setScale(1)
        this.bg2 = this.add.image(0, height, "bg3",)
        this.bg2.setScale(3)
        this.bg3 = this.add.image(0, height, "bg4",)
        this.bg3.setScale(3)

        this.nousImages = []
        let xPos = 400
        let yPos = 100
        const min = 0.1
        const max = 0.5
        const maxDis = 500
        const minDis = 50
        let randomScale = () => Math.random() * (max - min) + min;
        let randomDistance = () => Math.random() * (maxDis - minDis) + minDis;

        // this.add.image(0,  0, inputWidth, inputHeight, 'bg1')
        // this.add.image(0,  0, inputWidth, inputHeight, 'bg2')
        // this.add.image(0,  0, inputWidth, inputHeight, 'bg3')
        // this.add.image(0,  0, inputWidth, inputHeight, 'bg4')
        // // const ground = this.add.tileSprite(0, height, width * 2, 160, 'floor');


        // this.ground = this.physics.add.group();
        // this.ground.create(100, height - 100, 'floor')
        //     .setImmovable(true);


        //

        // ground.setOrigin(0, 1); // Adjust origin to align the ground properly
        //

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

        this.physics.world.setBoundsCollision(true, true, true, true);
        this.player = this.physics.add.sprite(110, height, 'frog');
        this.player.anims.play('idle');
        this.player.setCollideWorldBounds(true)
        this.player.setGravityY(50);
        this.input.on('pointerdown', this.startJump, this);
        this.input.on('pointerup', this.endJump, this);

        for (let i = 0; i < nousAmt; i++) {
            // this.ground = this.physics.add.group();
            // this.ground.create(100, height - 100, 'floor')
            //     .setImmovable(true);
            this.nousImages[i] = this.add.image(xPos, height, "nous" + i,)
            this.nousImages[i].setScale(randomScale())
            this.physics.add.collider(this.player, this.nousImages[i], () => {
                console.log('Collision detected between player and nousImages[' + i + ']');

            });
            xPos = xPos + randomDistance()
            yPos = yPos + 100
        }


        // const button = this.add.text(400, 200, 'Go to Next Scene', {
        //     fill: '#ffffff',
        //     backgroundColor: '#000000',
        //     padding: 10
        // }).setInteractive();
        //
        // button.on('pointerdown', () => {
        //     this.scene.start('NextScene'); // Replace 'NextScene' with the name of your next scene
        // });

    }

    startJump() {
        this.player.setVelocityY(-200);
        this.timer = this.time.addEvent({
            delay: 100,
            callback: this.tick,
            callbackScope: this,
            loop: true
        });

    }

    /*
    end the jump when the pointer is up
     */
    endJump() {
        this.timer.remove();
        this.player.setVelocityY(-this.power * 100);
        this.power = 0;
    }

    tick() {
        if (this.power < 5) {
            this.power += .1;
            console.log(this.power);
        }
    }

    update() {
        const max = 0.1
        const min = 0
        let moveAmount = () => Math.random() * (max - min) + min;

        function moveNous(direction) {
            for (let i = 0; i < nousAmt; i++) {
                if (direction == 'left') {
                    vm.nousImages[i].x = vm.nousImages[i].x - 5
                } else {
                    vm.nousImages[i].x = vm.nousImages[i].x + 5
                }

            }
        }

        const player = this.player;
        const vm = this;

        function left() {
            vm.bg.x = vm.bg.x + 0.3
            vm.bg1.x = vm.bg1.x + 0.2
            vm.bg2.x = vm.bg2.x + 0.1
            vm.bg3.x = vm.bg3.x + 0.1
            moveNous('right');
            player.x = player.x - moveAmount()
            player.anims.play('walk', true);
            player.setFlip(true, false)


        }

        function right() {
            vm.bg.x = vm.bg.x - 0.3
            vm.bg1.x = vm.bg1.x - 0.2
            vm.bg2.x = vm.bg2.x - 0.1
            vm.bg3.x = vm.bg3.x - 0.1
            player.anims.play('walk', true);
            player.x = player.x + moveAmount()
            player.setFlip(false, false);
            moveNous('left');
        }

        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.up.isDown) {
            this.startJump()
        }
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
