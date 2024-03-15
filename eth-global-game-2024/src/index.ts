import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import Lobby from './scenes/Lobby'

new Phaser.Game(
  Object.assign(config, {
    scene: [ Lobby, GameScene,]
  })
);
