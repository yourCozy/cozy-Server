var express = require('express');
var router = express.Router();

const ActivityController = require('../controllers/activityController');

router.get('/recommendation', ActivityController.showRecommendation);
router.get('/:bookstoreIdx', ActivityController.showActivities);
router.get('/category/:categoryIdx', ActivityController.showActivitiesByCategory);
router.get('/:filterIdx', ActivityController.showActivitiesByFilter);

module.exports = router;