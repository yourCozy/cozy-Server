const UserModel = require('../models/userModel');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const jwt = require('../modules/jwt');

const user = {
    socialLogin: async (req, res)=>{
        const {id, nickname, refreshToken} = req.body;
        const checkidResult = await UserModel.checkUserById(id);
        // 해당 id로 가입된 사용자가 있는 지 확인
        if(checkidResult.length>0){
            //이미 가입된 사용자라면
            console.log('로그인 되었습니다.');
            const user = await UserModel.getUserIdxById(id);
            const {token, _} = await jwt.sign(user[0]);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                userIdx: user[0].userIdx,
                nickname: user[0].nickname,
                id: user[0].id,
                profile: user[0].profileImg,
                jwtToken: token
            }));
        }else{
            //가입되지 않은 사용자
            console.log('회원가입 후 로그인되었습니다.');
            const userIdx = await UserModel.socialsignup(nickname, id, refreshToken);
            const user = await UserModel.getUserIdxById(id);
            const {token, _} = await jwt.sign(user[0]);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_AND_LOGIN, {
                userIdx: user[0].userIdx,
                nickname: user[0].nickname,
                id: user[0].id,
                profile: user[0].profileImg,
                jwtToken: token
            }));
        }
        /*
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
        */
    },
    kakaoLogout: async (req, res)=>{
        /*
        req.session.destroy();
        console.log('session을 삭제했습니다.');
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SESSION));
        */
    },
    callRefreshToken : async(req, res)=>{
        console.log('req.decoded : ', req.decoded);
        if(req.decoded===undefined){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.REQUIRE_LOGIN));
        }else{
            const userIdx = req.decoded.userIdx;
            const refreshToken = await UserModel.getRefreshTokenByUserIdx(userIdx);
            //console.log('refreshToken : ', refreshToken[0].refreshToken);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_REFRESH_TOKEN, {
                userIdx : userIdx,
                refreshToken : refreshToken[0].refreshToken
            }));
        }
    }
}
module.exports = user;