class Connection {
    constructor(server, game) {
        var self = this;
        this.player2 = {
            pseudo : '',
            obj : ''
        }
        this.socket = io.connect('', {query: 'token='+this.getCookie('auth')});
        this.socket.on('server', function(message) {
            console.log(message);
        });


        this.socket.on('iWantPlayWith', function(pseudo) {
            console.log(pseudo+' play with me.');
            var acs = game.getActionCtx(),
            yun = acs.generatePreObject2('yun');
            self.player2.obj = acs['objectScene'][yun];
            self.player2.pseudo = pseudo;
            self.player = acs['objectScene']['doneEntities'];
            self.socket.on('sendPositionToMe', function(position) {
                self.player2.obj.setPosition({
                    "x" : position.x,
                    "y" : position.y
                });
            });
            document.addEventListener("frameR", function(e) {
              self.sendPosition(self.player.getPosition());
            });

            self.player2.obj.addToScene(acs['scene']['scene']);
        });
    }
    callFriend(pseudo){
        this.socket.emit('iWantPlayWith', {
            "pseudo": pseudo
        });
    }
    sendPosition(position){
        if(this.player2.pseudo != ''){
            this.socket.emit('sendPositionToHim', position);
        }
    }
    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }
}
