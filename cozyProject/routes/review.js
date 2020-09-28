var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const ReviewController = require('../controllers/reviewController');

// router.get('/:bookstoreIdx', ReviewController.showReviewsByBookstore);

// router.get('/two/:bookstoreIdx', ReviewController.showTwoReviewsByBookstore);

router.get('/mine', AuthMiddleware.checkToken, ReviewController.showMyReviews);

// 후기 작성 + 사진 등록 한 번에 할 수 있는 방법 없나?
router.post('/:bookstoreIdx', AuthMiddleware.checkToken, ReviewController.writeReview);

// router.get('/:reviewIdx', AuthMiddleware.checkToken, ReviewController.storeUpdatedReview);

router.put('/:reviewIdx', AuthMiddleware.checkToken, ReviewController.updateReview);

router.delete('/:reviewIdx', AuthMiddleware.checkToken, ReviewController.deleteReview);

// 간편후기
router.post('/simple/:bookstoreIdx', AuthMiddleware.checkToken, ReviewController.writeSimpleReview);

router.get('/simple/:bookstoreIdx', ReviewController.showSimpleReviews); // 후기 제공 범위 어디까지? 아마 모든 사용자~~
// TODO: 내 간편후기 조회 등 api 필요한지 확인 후 만들기!

module.exports = router;