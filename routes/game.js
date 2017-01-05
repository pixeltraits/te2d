var express = require('express'),
router = express.Router();

// route middleware to verify a token
router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    res.render('game', { layout: 'layoutGame'});
});

module.exports = router;
