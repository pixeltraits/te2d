var express = require('express'),
router = express.Router(),
validator = require('validator'),
bcrypt = require('bcrypt'),
jwt    = require('jsonwebtoken'),
secret = 'chathonMignonPleinD****',
SALT_WORK_FACTOR = 10,
User = require('../model/user');

router.use(function(req, res, next) {
  var token = req.cookies.auth;
  if (token) {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        next();
      } else {
        res.redirect('../game');
      }
    });
  } else {
    next();
  }
});

router.get('/create', function(req, res) {
    res.render('create', { layout: 'layout', csrfToken: req.csrfToken() });
});
router.get('/login', function(req, res) {
    res.render('login', { layout: 'layout', csrfToken: req.csrfToken() });
});

router.get('/list', function(req, res) {
    User.find(function(err, user) {
        if (err) {
          return res.send(err);
        }

        res.json(user);
    });
});

router.post('/new', function(req, res) {
    if(validator.isEmail(req.body.email) && validator.isAlphanumeric(req.body.pseudo)) {
        if(validator.isAlphanumeric(req.body.password)) {
          if(validator.isAlphanumeric(req.body.confPassword)) {
            if(req.body.password == req.body.confPassword) {
              var newUser = {
                pseudo : req.body.pseudo,
                email : req.body.email,
                encPassword : cryptPass(req.body.password)
              };
              var user = new User(newUser);
              user.save(function(err) {
                if (err) {
                  return res.send(err);
                }
                res.send({ message: 'Compte crée.' });
              });
            }else {
              res.send({ message: 'Les mots de passe ne correspondent pas.' });
            }
          }else {
            res.send({ message: 'Le mot de passe n\'est pas valide' });
          }
        }else {
          res.send({ message: 'Le mot de passe n\'est pas valide' });
        }
    }else {
        res.send({ message: 'Un champ n\'est pas valide. ' });
    }
});

router.put('/update/:id', function(req,res){
    User.findOne({ _id: req.params.id }, function(err, user) {
        if (err) {
          return res.send(err);
        }

        for (prop in req.body) {
          user[prop] = req.body[prop];
        }

        // save the movie
        user.save(function(err) {
          if (err) {
            return res.send(err);
          }

          res.json({ message: 'Compte utilisateur mis à jour.' });
        });
    });
});

router.get('/:id', function(req, res) {
    //User.findOne({ _id: req.params.id}, function(err, user) {
        //if (err) {
          //return res.send(err);
        //}

        //res.json(user);
    //});
});

router.delete('/delete/:id', function(req, res) {
    User.remove({
        _id: req.params.id
        }, function(err, user) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Compte utilisateur suprimé.' });
    });
});
var cryptPass = function(pass){
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(pass, salt);

    return hash;
};

router.post('/connection', function(req, res) {

  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Ce compte n\'éxiste pas.' }).redirect('/login');
    } else if (user) {
      var testPass = false;
      // check if password matches
      bcrypt.compare(req.body.password, user.encPassword, function(err, res) {
          testPass = res;
      });
      if (testPass) {
        res.json({ message: 'Le mot de passe et le compte ne correspondent pas.' }).redirect('/login');
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, secret,{
          expiresIn : 60*60*24 // expires in 24 hours
        });

        res.cookie('auth', token, {maxAge : 60*60*24}).redirect('../game');

      }

    }

  });
});

module.exports = router;
