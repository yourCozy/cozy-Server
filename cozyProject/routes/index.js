var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express-cozy' });
});

router.use('/bookstore', require('./bookstore'));
router.use('/mypage', require('./mypage'));
router.use('/review', require('./review'));

module.exports = router;
