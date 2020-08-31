var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController');
const SocialMiddleware = require('../middlewares/social');


router.get('/kakao', SocialMiddleware.kakao, UserController.kakaoToken);

router.get('/kakao/logout', UserController.kakaoLogout);
// 카카오
// 구글
// 애플

module.exports = router;