var express = require('express');
var router = express.Router();

const ActivityController = require('../controllers/activityController');

router.get('/recommendation', ActivityController.showRecommendation);

router.get('/:bookstoreIdx', ActivityController.showActivities);

router.post('/', ActivityController.registerActivity);

router.get('/category/latest/:categoryIdx', ActivityController.showActivitiesByLatest); // 최신순

router.get('/category/deadline/:categoryIdx', ActivityController.showActivitiesByDeadline); // 마감 임박순

module.exports = router;