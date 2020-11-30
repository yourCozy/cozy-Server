const UserModel = require('../models/userModel');
const encrypt = require('../modules/crypto');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const jwt = require('../modules/jwt');
const mailer = require('../modules/mailer');
const multer = require('../modules/multer');

const cookie = require('cookie-parser');

const session = require('express-session');
const { now } = require('moment');

const user = {
    checkNickname: async (req, res)=>{
        const {nickname} = req.body;
        if(!nickname){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        const result = await UserModel.checkUserByNickname(nickname);
        if(result.length!==0){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ALREADY_NICKNAME));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.AVAILABLE_NICKNAME, {nickname: nickname}));
    },
    checkEmail: async(req, res)=>{
        const {email} = req.body;

        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        
        if(!email){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        //이메일 형식 아닐 시
        if ( !regExp.test(email) ) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NOT_EMAIL_FORM));
        }
        const result = await UserModel.checkUserByEmail(email);
        if(result.length!==0){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ALREADY_EMAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.AVAILABLE_EMAIL));
    },
    checkAccount: async(req, res)=>{
        //token으로 확인할지 
        //코드 추가해야함 !!!!!!!!!
        if (req.decoded === undefined) { 
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
       } else {
            const userIdx = req.decoded.userIdx;
            const result = await UserModel.checkAccount(userIdx);
            if(result.length==0){
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.GET_ACCOUT_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_ACCOUT_SUCCESS ,{
                profileImg: user[0].profileImg,
                tel: user[0].tel,
            }));
        }            
    },
    signup : async (req, res) => {
        const {
            nickname,
            email,
            password,
            passwordConfirm
        } = req.body;
        if (!nickname || !email || !password || !passwordConfirm ){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_SIGNUP_VALUE)); 
        }
        //var regPw = /^[a-zA-Z0-9~!@#$%^&*()_+|<>?:{}]{8,20}$/i;
        //var regname = /(([a-z])([A-Z])([0-9])([^a-zA-Z0-9가-힣]).{1,10})/i;
        //이름 정책
        var regname = /^[a-z0-9A-Zㄱ-ㅎ|ㅏ-ㅣ|가-힣]{1,10}$/;
        //비밀번호 정책
        //var regPw = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]){10,20})$/i;
        var regPw = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/i;
        if ( !regname.test(nickname) ) {
            return res.status(statusCode.OK)
                .send(util.fail(statusCode.OK, resMessage.NOT_NAME_FORM));
        }
        const result = await UserModel.checkUserByEmail(email);
        if(result.length!==0){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ALREADY_EMAIL));
        }
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if ( !regExp.test(email) ) {
            return res.status(statusCode.OK)
                .send(util.fail(statusCode.OK, resMessage.NOT_EMAIL_FORM));
        } //checkemail에서 확인은 해주긴 함
        else{
            if ( !regPw.test(password)) {
                return res.status(statusCode.OK)
                .send(util.fail(statusCode.OK, resMessage.NOT_PASSWORD_FORM));
            }
            if(password !== passwordConfirm){
            //비밀번호와 비밀번호 확인이 다르다면
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.DIFFERENT_PW));
            }
            //salt, hash이용해서 비밀번호 암호화
            else{
                const {
                    salt,
                    hashed
                } = await encrypt.encrypt(password);

               //models.user.js 의 signup 쿼리 이용해서 회원가입 진행
                const idx = await UserModel.signup(nickname, email, hashed, salt);
                const user = await UserModel.getUserIdxByEmail(email); 
                const {token, _} = await jwt.sign(user[0]);

                if (idx === -1) {
                    return res.status(statusCode.DB_ERROR)
                        .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
                }
                console.log(hashed);
                res.status(statusCode.OK)
                    .send(util.success(statusCode.OK, resMessage.CREATED_USER, {
                        userIdx: idx,
                        jwtToken: token
                }));
            }
        }
    },
    signin : async (req, res) => {
        const {
            email,
            password,
            //autoLogin
        } = req.body;
        if (!email || !password) {
            res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
            return;
        }
        // User의 email이 있는지 확인 - 없다면 NO_USER 반납
        const user = await UserModel.checkUserByEmail(email);
        // statusCode: 204 => 요청에는 성공했으나 클라가 현재 페이지에서 벗어나지 않아도 된다.~~
        // 페이지는 바뀌지 않는데 리소스는 업데이트될 때 사용
        if (!user[0]) {
            //회원 없을 시 
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_USER));
        } else{
        // req의 Password 확인 - 틀렸다면 MISS_MATCH_PW 반납
            const hashed = await encrypt.encryptWithSalt(password, user[0].salt);
            if (hashed !== user[0].hashed) { //회원은 있지만 비번 틀렸을 경우
                return res.status(statusCode.OK)
                .send(util.fail(statusCode.OK, resMessage.MISS_MATCH_PW));
            }
            else{ //회원있고 비번 맞고
            
            /*
            var expireDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 7); // 24 hour 7일

            // if (req.body.autoLogin === 'checked') {
            //         console.log("자동로그인 체크!");
            //     }

                res.cookie('autoLogin', {userIdx: user[0].userIdx}, {
                    expires: expireDate
                });    
            //     res.cookie('autoLogin', {email: req.body.email, hashed: user[0].hashed}, {
            //         expires: expireDate
            //     });    
            // console.log(user[0]);
            // 로그인 성공적으로 마쳤다면 - LOGIN_SUCCESS 전달 
            */

            // 토큰 인증
            const {token, _} = await jwt.sign(user[0]);
            user[0].accessToken = token;
            // 삭제하면 token 값때문에 로그인할때마다 다시 갱신됨;ㅁ;
            // res.clearCookie('bookstores');

            // // 세션에 토큰값 저장
            // console.log('req.session: ',req.session);
            // console.log('token', token);
            // if (req.session.token) {
            //     console.log('session valid...(', req.session.key, ')');
            //     console.log('session valid');
            // } else {
            //     console.log('else 로 들어왔다');
            //     req.session.token = token; // token 값으로 세션에 (key=token)값 저장
            //     console.log('session save success...(', req.session.key, ')');
            //     console.log('session save success');
            // }

            let isLogined = await UserModel.checkIsLogined(email);
            if (isLogined < 1) {
                const result = await UserModel.updateIsLogined(email);
                console.log(result);
                res.status(statusCode.OK)
                .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                    userIdx: user[0].userIdx,
                    nickname: user[0].nickname,
                    email: user[0].email,
                    profile: user[0].profileimg,
                    accessToken: user[0].accessToken,
                    is_logined: 0
                }));
            } else {
                res.status(statusCode.OK)
                    .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                        userIdx: user[0].userIdx,
                        nickname: user[0].nickname,
                        email: user[0].email,
                        profile: user[0].profileimg,
                        accessToken: user[0].accessToken,
                        is_logined: user[0].is_logined
                    }));
                }
            }
        }
    },
    updateImages: async(req, res)=>{
        const bookstoreIdx=req.params.bookstoreIdx;
        let imageLocations=[];
        for(var i=0;i<3;i++){
            imageLocations[i]=req.files[i].location;
        }
        const result=await UserModel.updateImages(bookstoreIdx, imageLocations);
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.UPDATE_IMAGE_SUCCESS, result));
    },
    updateProfile: async (req, res) => {
        // 데이터 받아오기
        const userIdx = req.decoded.userIdx;
        console.log(userIdx);
        // jwt 토큰을 가져와서 디코드 시켜줌
        // 체크토큰은 decoded된 정보를 담아줌
        console.log(req.file);
        const profile = req.file.location;
        console.log(profile);
        // s3는 path를 location으로 
        // 최종 업로드되는 파일의 이름이 path에 저장됨
        // 이름이 저장될 때 중복되면 안되므로 multer가 알아서 키값을 어렵고 복잡하게 만들어서 저장?
        // +) ms 단위의 시간으로 파일이름 저장해줘도 좋음!

        // data check - undefined
        if (profile === undefined || !userIdx) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        // image type check
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UNSUPPORTED_TYPE));
        }
        // call model - database
        // 결과값은 프로필에 대한 이미지 전달
        const result = await UserModel.updateProfile(userIdx, profile);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_PROFILE_SUCCESS, result[0]));
    },
    findPassword: async(req, res)=>{
        const userEmail=req.body.email;
        console.log('email:', userEmail);
        //데이터 누락
        if(!userEmail){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        //해당 이메일이 db에 없을 때
        const result = await UserModel.checkUserByEmail(userEmail);
        if(result.length===0){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_USER));
        }
        //임시 비밀번호를 해당 이메일로 발송
        try{
            const newPW = Math.random().toString(36).slice(2);
            let emailParam = {
                toEmail : userEmail,
                subject : 'New Email From COZY',
                text : `COZY 새 비밀번호 입니다! :)\nNew Password : ${newPW}`
            };
            const {
                salt,
                hashed
            } = await encrypt.encrypt(newPW);
            await UserModel.updateNewPW(userEmail, hashed, salt);
            mailer.sendGmail(emailParam);
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEND_EMAIL_SUCCESS, {
                toEmail : userEmail,
                subject: 'New Email From COZY'
            }))
        }catch(err){
            console.log('find PW by email mailer ERR : ',err);
            throw err;
        }
    },
    kakaoLogin: async (req, res)=>{
        const {email, nickname, autoLogin}=req.body;
        const checkEmailResult = await UserModel.checkUserByEmail(email);
        if(checkEmailResult.length==1){
            console.log('로그인 되었습니다.');
            const user = await UserModel.getUserIdxByEmail(email);
            req.session.userIdx = user[0].userIdx;
            if(autoLogin == "true"){
                //자동로그인 승인
                req.session.cookie.originalMaxAge = 365*24*60*60*1000;
                //req.session.cookie.originalMaxAge = 1000;
            }else{
                req.session.cookie.expires = false;
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                userIdx: user[0].userIdx,
                nickname: user[0].nickname,
                email: user[0].email,
                profile: user[0].profileImg
            }));
        }else{
            console.log('회원가입 -> 로그인 되었습니다.');
            const userIdx = await UserModel.signup(nickname, '', '', email);
            const user = await UserModel.getUserIdxByEmail(email);
            req.session.userIdx = userIdx;
            if(autoLogin == "true"){
                //자동로그인 승인
                req.session.cookie.originalMaxAge = 365*24*60*60*1000;
                //req.session.cookie.originalMaxAge = 1;
            }else{
                req.session.cookie.expires = false;
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_AND_LOGIN, {
                userIdx: user[0].userIdx,
                nickname: user[0].nickname,
                email: user[0].email,
                profile: user[0].profileImg
            }));
        }
        /*
            const nickname = req.params.data.properties.nickname;
            const email = req.params.data.kakao_account.email;

            const checkEmailResult = await UserModel.checkUserByEmail(email);
            console.log('checkEmailResult : ', checkEmailResult);

            if(checkEmailResult.length==1){
                console.log('로그인 되었습니다.');
                const user = await UserModel.getUserIdxByEmail(email);

                req.session.userIdx = user[0].userIdx;
                req.cookies.session_id = req.sessionID;
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.AUTH_SUCCESS, {
                    userIdx: user[0].userIdx,
                    nickname: user[0].nickname,
                    email: user[0].email,
                    profile: user[0].profile,
                    accessToken: user[0].accessToken
                }));
            }else{
                console.log('회원가입 -> 로그인 되었습니다.');
                const userIdx = await UserModel.signup(nickname, '', '', email);
                const user = await UserModel.getUserIdxByEmail(email);

                req.session.userIdx = user[0].userIdx;
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_AND_LOGIN, {
                    userIdx: user[0].userIdx,
                    nickname: user[0].nickname,
                    email: user[0].email,
                    profile: user[0].profile,
                    accessToken: user[0].accessToken
                }));
            }
            */
            
    },
    kakaoLogout: async (req, res)=>{
        req.session.destroy();
        console.log('session을 삭제했습니다.');
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SESSION));
    },
    signOut: async (req, res) => {
        // redis or mongoDB 에 로그인 정보 저장해두었다가 로그아웃시 삭제하는 식으로 구현해야 함.
        // res.clearCookie('token');
        // console.log(req.cookies.token);
        // res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGOUT_SUCCESS));

        // 세션 삭제
        // req.session.destroy(function (err) {
        //     if (err) {
        //         console.log(err);
        //         res.status(statusCode.BAD_REQUEST).send(util.false(statusCode.BAD_REQUEST, resMessage.SESSION_NOT_DESTROYED));
        //     } else {
        //         console.log('session destroyed success...');
        //         res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SESSION_DESTROYED));
        //     }
        // })
    },
    checkSession: async (req, res) => {
        if (req.session.token) {
            console.log('session valid: ', req.session.token);
            res.send('session valid');
        } else {
            res.send('session is not valid');
        }
    }
}
module.exports = user;