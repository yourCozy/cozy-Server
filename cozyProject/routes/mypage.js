var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const MypageController = require('../controllers/mypageController');

router.post('/recommendation', AuthMiddleware.checkToken, MypageController.registerRecommendation);
// 나중에 취향 저장한 것 수정하는 기능도 추가할 것.

router.get('/interest', AuthMiddleware.checkToken, MypageController.showInterest);

router.put('/interest/:bookstoreIdx', AuthMiddleware.checkToken, MypageController.updateBookmark);

router.get('/recent', AuthMiddleware.checkToken, MypageController.showRecent);

module.exports = router;