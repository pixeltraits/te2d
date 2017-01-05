window.onload=function(){
    var myGame = new Game("game", "config.json", function(){
      console.log('jeu pret');
    });
    //var myOnlineGame = new Connection('http://admin.chathon.com', myGame);


    //var inputFriend = document.getElementById('friend');
    //var validFriend = document.getElementById('validFriend');
    //validFriend.addEventListener("click", function(){
      //  myOnlineGame.callFriend(inputFriend.value);
    //});
}
