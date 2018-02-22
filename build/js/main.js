import Game from '../te2d/Game.js';

window.onload = () => {
  const myGame = new Game('public/game/', 'config.json', () => {
    myGame.loadLevel('theworld', () => {
      myGame.startLevel();
    });
  });
};
