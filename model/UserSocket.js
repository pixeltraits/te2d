module.exports = class UserSocket {
    constructor(data){
        this.pseudo = data.pseudo;
        this.socketId = data.socketId;
    }
};