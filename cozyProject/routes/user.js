const express = require('express');
const router = express.Router();
const upload = require('../modules/multer');

const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middlewares/auth');

router.post('/checknickname', UserController.checkNickname);

router.post('/checkemail', UserController.checkEmail); //중복확인 및 이메일 형식

router.post('/signin', UserController.signin); //이메일 입력: 글자수 제한35자(제한을 넘겼다면 더 이상 입력 불가):클라에서 막기
//로그인 성공 : 로그인 성공! - 로그인 실패: ID/PW를 확인해주세요
//아이디는 맞는데 비밀번호 틀렸을 시 - PW가 잘못 입력되었다면 문구 표시(비밀번호를 확인해주세요)
//이메일이 잘못 입력되었다면 문구 표시(이메일을 확인해주세요)

router.post('/signup', UserController.signup); //회원가입

router.get ('/checkaccount', UserController.checkAccount); //ID/PW 찾기 후 이메일 로그인

router.post('/uploadImage/:bookstoreIdx', upload.array('profile'), UserController.updateImages);

router.post('/findpw', UserController.findPassword);

// 로그아웃은 클라에서 처리

/* 
    ✔️ update profile
    METHOD : POST
    URI : localhost:3000/user/profile
    REQUEST HEADER : JWT
    REQUEST BODY : ⭐️image file ⭐️
    RESPONSE DATA : user profile
*/
router.post('/profile', AuthMiddleware.checkToken, upload.single('profile'), UserController.updateProfile);//


module.exports = router;