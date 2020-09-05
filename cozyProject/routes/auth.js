var express = require('express');
var router = express.Router();

const SocialController = require('../controllers/socialController');
const AuthMiddleware = require('../middlewares/auth');

// 카카오
router.post('/social', SocialController.socialLogin);
//router.get('/kakao/logout', SocialController.kakaoLogout);

// 구글

// 애플

/**
 * refreshToken 클라로 보내기
 * header에 token : {jwt} 로 로컬 서버로 보내야 함.
 */
router.get('/refresh', AuthMiddleware.checkToken, SocialController.callRefreshToken);
module.exports = router;