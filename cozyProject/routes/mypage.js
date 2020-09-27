var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const MypageController = require('../controllers/mypageController');
const upload = require('../modules/multer');

router.post('/recommendation', AuthMiddleware.checkToken, MypageController.registerTastes);

router.put('/recommendation', AuthMiddleware.checkToken, MypageController.updateTastes);

router.get('/interest', AuthMiddleware.checkToken, MypageController.showInterest);

router.put('/interest/:bookstoreIdx', AuthMiddleware.checkToken, MypageController.updateBookmark);


// 활동 관련 북마크 추가 에정

router.get('/myinfo', AuthMiddleware.checkToken, MypageController.showMyInfo);

router.get('/recent', MypageController.showRecent);

//개인 정보 변경 클릭 -> 일단 내 정보가 보여질 때
router.get('/update/myinfo', AuthMiddleware.checkToken, MypageController.updateMyinfo);//완료

//로컬 로그인으로 가입했을 때만 사용 가능
router.post('/update/profile', AuthMiddleware.checkToken, upload.single('profile'), MypageController.updateProfile);//완료
router.post('/update/nickname', AuthMiddleware.checkToken, MypageController.updateNickname);//완료
router.post('/update/tel', AuthMiddleware.checkToken, MypageController.updateTel);
router.post('/update/password/1', AuthMiddleware.checkToken, MypageController.sendAuthCode);//완료
router.post('/update/password/2', AuthMiddleware.checkToken, MypageController.updatePassword);//완료



module.exports = router;