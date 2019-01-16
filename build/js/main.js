import Game from '../te2d/Game.js';

window.onload = () => {
  const myGame = new Game('public/game/', 'config.json');
  myGame.prepareGame().then(() => {
    myGame.loadLevel('theworld').then(() => myGame.startLevel()).catch(() => {
      console.log('Erreur lors du chargement du Level.');
    });
  }).catch((error) => {
    console.log('Erreur lors du chargement du Jeu.');
  });
};
