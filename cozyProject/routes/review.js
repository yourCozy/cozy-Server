var express = require('../controllers/reviewController');
var router = express.Router();

const ReviewController = require('../controllers/reviewController');

router.get('/:bookstoreIdx', ReviewController.showReviewsByBookstore);
router.get('/two/:bookstoreIdx', ReviewController.showTwoReviewsByBookstore);
router.get('/:userIdx', ReviewController.showMyReviews);
// 후기 작성 + 사진 등록 한 번에 할 수 있는 방법 없나?
router.post('/:bookstoreIdx', ReviewController.createReview);
router.get('/:reviewIdx', ReviewController.showSelectedReview);
router.put('/:reviewIdx', ReviewController.updateReview);
router.delete('/:reviewIdx', ReviewController.deleteReview);

module.exports = router;