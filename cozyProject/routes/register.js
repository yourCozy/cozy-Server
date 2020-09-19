var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const RegisterController = require('../controllers/registerController');
const upload = require('../modules/multer');

router.post('/image/:bookstoreIdx', upload.array('photo'), RegisterController.registerImage); // (table)bookstore -> mainImg, profileImg

router.post('/detailimg/:bookstoreIdx', upload.array('photo'), RegisterController.registerDetailImage); // (table)bookstoreImg -> image1, image2,,, image7

router.post('/activity/:activityIdx', upload.array('photo'), RegisterController.registerActivityImage);

module.exports = router;