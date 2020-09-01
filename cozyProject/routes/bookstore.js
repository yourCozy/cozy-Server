var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const BookstoreController = require('../controllers/bookstoreController');
const SessionMiddleware = require('../middlewares/session');

// router.post('/recommendation', AuthMiddleware.checkToken, BookstoreController.registerRecommendation);

router.get('/recommendation', AuthMiddleware.checkToken, BookstoreController.showRecommendation); // 사용자마다 취향 다름

router.get('/detail/:bookstoreIdx', AuthMiddleware.checkToken, BookstoreController.showDetail); // 북마크 때문에 토큰 필요

router.get('/section/:sectionIdx', AuthMiddleware.checkToken, BookstoreController.showBookstoresBySection); // 북마크

router.get('/search/:keyword', BookstoreController.searchByKeyword);

module.exports = router;