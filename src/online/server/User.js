/**
 * addUser
 * @method addUser
 * @param  {object} userData blalbvla
 * @return {Array} usersS[x2]
 */
function addUser(userData) {
  let x = 0;
  const lengthX = usersS.length;

  for (; x < lengthX; x++) {
    if (usersS[x].pseudo == userData.pseudo) {
      usersS[x] = userData;
      return usersS[x];
    }
  }

  var x2 = usersS.length;
  usersS[x2] = userData;

  return usersS[x2];
}

function findUserByPseudo(pseudo) {
  var x = 0,
  lengthX = usersS.length;

  for(;x<lengthX;x++) {
    if(usersS[x].pseudo == pseudo) {
      return usersS[x].socketId;
    }
  }

  return false;
}

function deleteUserByPseudo(pseudo) {
  var x = 0,
  lengthX = usersS.length;

  for(;x<lengthX;x++) {
    if(typeof usersS[x] != "undefined") {
      if(usersS[x].pseudo == pseudo){
        usersS.splice(x, 1);
      }
    }
  }
}
