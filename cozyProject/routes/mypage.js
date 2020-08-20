var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const MypageController = require('../controllers/mypageController');

router.get('/interest', AuthMiddleware.checkToken, MypageController.showInterest);
router.put('/interest/:bookstoreIdx', AuthMiddleware.checkToken, MypageController.updateBookmark);
router.get('/recent', AuthMiddleware.checkToken, MypageController.showRecent);

module.exports = router;