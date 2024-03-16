import Phaser from 'phaser';

const speedDown = 300;
export default {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#33A5E7',

    scale: {
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade:{
            gravity:{y:speedDown}
        }
    }
};
