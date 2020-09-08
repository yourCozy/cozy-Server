var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const MypageController = require('../controllers/mypageController');

router.post('/recommendation', AuthMiddleware.checkToken, MypageController.registerTastes);

router.put('/recommendation', AuthMiddleware.checkToken, MypageController.updateTastes);

router.get('/interest', AuthMiddleware.checkToken, MypageController.showInterest);

router.put('/interest/:bookstoreIdx', AuthMiddleware.checkToken, MypageController.updateBookmark);

// 활동 관련 북마크 추가 에정

//router.get('/myinfo', AuthMiddleware.checkToken, MypageController.showmyInfo);

router.get('/recent', MypageController.showRecent);

module.exports = router;