var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const ReviewController = require('../controllers/reviewController');

router.get('/:bookstoreIdx', AuthMiddleware.checkToken, ReviewController.showReviewsByBookstore);
router.get('/two/:bookstoreIdx', AuthMiddleware.checkToken, ReviewController.showTwoReviewsByBookstore);
router.get('/:userIdx', AuthMiddleware.checkToken, ReviewController.showMyReviews);
// 후기 작성 + 사진 등록 한 번에 할 수 있는 방법 없나?
router.post('/:bookstoreIdx', AuthMiddleware.checkToken, ReviewController.writeReview);
router.get('/:reviewIdx', AuthMiddleware.checkToken, ReviewController.storeUpdatedReview);
router.put('/:reviewIdx', AuthMiddleware.checkToken, ReviewController.updateReview);
router.delete('/:reviewIdx', AuthMiddleware.checkToken, ReviewController.deleteReview);

module.exports = router;