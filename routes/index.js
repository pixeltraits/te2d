const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.render('index', { layout: 'layout' });
});

module.exports = router;
