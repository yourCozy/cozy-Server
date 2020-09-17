var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express-cozy' });
});

router.use('/bookstore', require('./bookstore'));

router.use('/mypage', require('./mypage'));

router.use('/review', require('./review'));

router.use('/activity', require('./activity'));

router.use('/user', require('./user'));

router.use('/auth', require('./auth'));

router.use('/comment', require('./comment'));

router.use('/register', require('./register'));

// router.use('/auth', require('./auth'));

module.exports = router;
