const UserSocket = require('../model/UserSocket');
const jwt = require('jsonwebtoken');

// Si connection du client en mode socket
io.on('connection', (socket) => {
  jwt.verify(socket.handshake.query.token, secret, (err, decoded) => {
    const token = decoded;
    const userSo = addUser(new UserSocket({
        pseudo: token._doc.pseudo,
        socketId: socket.id
    }));
    socket.on('iWantPlayWith', function (data) {
        var friendId = findUserByPseudo(data.pseudo);
        if(friendId){
          io.sockets.connected[friendId].emit('iWantPlayWith', userSo.pseudo);
          socket.on('sendPositionToHim', function (data) {
            io.sockets.connected[friendId].emit('sendPositionToMe', data);
          });
        }else{
          socket.emit('server', 'Votre ami n\'est pas connecté.');
        }
    });

    socket.on('disconnect', function() {
        console.log('Vous avez ete deconnecte');
        deleteUserByPseudo(userSo.pseudo);
     });
    socket.emit('server', 'Vous êtes en ligne '+userSo.pseudo);
  });
});

const secret = 'chathonMignonPleinD****';
