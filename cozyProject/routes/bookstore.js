var express = require('express');
var router = express.Router();

const BookstoreController = require('../controllers/bookstoreController');

router.post('/recommendation', BookstoreController.registerRecommendation);
router.get('/recommendation', BookstoreController.showRecommendation);
router.get('/detail/:bookstoreIdx', BookstoreController.showDetail);
router.get('/section/:sectionIdx', BookstoreController.showBooskstoreBySection);
router.get('/search/:keyword', BookstoreController.searchByKeyword);

module.exports = router;