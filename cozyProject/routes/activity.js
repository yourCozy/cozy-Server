var express = require('express');
var router = express.Router();

const ActivityController = require('../controllers/activityController');

//router.get('/recommendation', ActivityController.showRecommendation);

router.get('/:bookstoreIdx', ActivityController.showActivitiesByBookstore);

router.post('/', ActivityController.registerActivity);//😈sprint3

router.get('/category/latest/:categoryIdx', ActivityController.showActivitiesByLatest); // 최신순

router.get('/category/deadline/:categoryIdx', ActivityController.showActivitiesByDeadline); // 마감 임박순

router.get('/detail/:activityIdx', ActivityController.showActivityDetail);

module.exports = router;