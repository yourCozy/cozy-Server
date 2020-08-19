var express = require('express');
var router = express.Router();

const MypageController = require('../controllers/mypageController');

router.get('/interest', MypageController.showInterest);
router.put('/interest/:bookstoreIdx', MypageController.updateBookmark);
router.get('/recent', MypageController.showRecent);

module.exports = router;