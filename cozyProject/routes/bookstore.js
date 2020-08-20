var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const BookstoreController = require('../controllers/bookstoreController');

router.post('/recommendation', AuthMiddleware.checkToken, BookstoreController.registerRecommendation);
router.get('/recommendation', AuthMiddleware.checkToken, BookstoreController.showRecommendation);
router.get('/detail/:bookstoreIdx', AuthMiddleware.checkToken, BookstoreController.showDetail);
router.get('/section/:sectionIdx', AuthMiddleware.checkToken, BookstoreController.showBookstoresBySection);
router.get('/search/:keyword', AuthMiddleware.checkToken, BookstoreController.searchByKeyword);

module.exports = router;