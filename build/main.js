window.onload = () => {
    const myGame = new Game("public/game/", "config.json", () => {
      myGame.loadLevel('theworld', () => {
        myGame.startLevel();
      });
    });
}
