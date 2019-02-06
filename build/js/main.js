import Game from '../te2d/Game.js';

window.onload = async () => {
  const myGame = new Game('public/game/', 'config.json');

  try {
    await myGame.prepareGame();
  } catch (error) {
    console.log('Erreur lors du chargement du Jeu.', error);
  }

  try {
    await myGame.loadLevel(
      'theworld',
      () => {
        myGame.startLevel();
      }
    );
  } catch (error) {
    console.log('Erreur lors du chargement du Level.');
  }
};
