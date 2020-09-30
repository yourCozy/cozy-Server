const MypageModel = require('../models/mypageModel');

const encrypt = require('../modules/crypto');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const mailer = require('../modules/mailer');
const e = require('express');

const mypage = {
    registerTastes: async (req, res) => {
        if (req.decoded === undefined) { 
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        }
        else{ 
            const userIdx = req.decoded.userIdx;
            // let count = Object.keys(req.query).length; // json 객체 개수 반환
            var opt = Object.values(req.query); // json 객체의 value 값들을 배열로 반환
            // console.log(opt);
            const userResult = await MypageModel.checkUser(userIdx);
            if (userResult.length > 0) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ALREADY_USER));
            }

            try {
                const result = await MypageModel.registerTastes(userIdx, opt);
                if (!result.length) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.REGISTER_TASTES_FAIL));
                }
                else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_TASTES_SUCCESS, result[0]));
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        // 온보딩에서 취향 선택을 할 시에는 해시태그+문화활동 합쳐서 받음. 제일 처음에 뜨는 추천 탭에는 사용자의 취향선택과 가장많이 중복되는 책방부터 출력.
        }
    },
    updateTastes: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        var opt = Object.values(req.query); // json 객체의 value 값들을 배열로 반환
        console.log(opt);

        try {
            const result = await MypageModel.updateTastes(userIdx, opt);
            
            // const tastes = result[0].tastes;
            // const bookstores = await MypageModel.orderByTastes(userIdx, tastes);
            // console.log(bookstores);

            if (!result.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UPDATE_TASTES_FAIL));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_TASTES_SUCCESS, result[0]));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showInterest : async (req, res) => {
        const userIdx = req.decoded.userIdx;


        //console.log('interest cookie : ', req.cookies.autoLogin);
        /*
        const userIdx = req.cookies.autoLogin.userIdx;
        let userIdx;
        if(req.cookies.autoLogin === undefined ){
            //로그인 페이지로 돌아가기
            res.writeHead(302, {'Location':'user/signin'});
            res.end();
        }else{
            userIdx = req.cookies.autoLogin.userIdx
        }
        */
        
        console.log('userIdx: ',userIdx);
        try{
            const interest = await MypageModel.showInterest(userIdx);
            console.log('interest: ', interest);
            if(interest.length === 0){
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_DATA, {
                    bookstoreIdx: null,
                    bookstoreName: null,
                    mainImg: null,
                    hashtag1: null,
                    hashtag2: null,
                    hashtag3: null,
                    location: null,
                    shortIntro1: null,
                    shortIntro2: null
                }));
            }else{
                console.log(interest);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, interest));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showMyInfo: async (req, res) => {
        
        //const {token, _} = await jwt.sign(user[0]);
        if (req.decoded === undefined) { 
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        } else {
            try {
                const userIdx = req.decoded.userIdx;
                const result = await MypageModel.showInfo(userIdx);
                if (result.length>0) {
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_MYINFO_SUCCESS, result));
                }
                else return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.SHOW_MYINFO_FAIL));
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    updateBookmark: async (req, res) => {
        const bookstoreIdx = req.params.bookstoreIdx;
        if (req.decoded === undefined) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        } else {
            const userIdx = req.decoded.userIdx;
            try {
                const result = await MypageModel.updateBookmark(userIdx, bookstoreIdx);
                let message = '북마크 체크';
                if(result === 0){// 북마크 해제 됨
                    message = '북마크 해제';
                }
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOKMARK_SUCCESS, {checked: result}));
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
        
    },
    showRecent : async (req, res) => {
        // const userIdx = req.decoded.userIdx;
        // 로그인하지 않은 상태에서 본 책방은 쿠키에 저장되고 로그인해도 계속 남아있음
        // 로그아웃하고 다른 아이디로 로그인하면 쿠키 삭제되어 있음
        var bookstores = req.cookies.bookstores;


        if (!req.cookies.bookstores) {
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_RECENT_BOOKSTORES));
        }
        
        // json 객체 담을 배열
        var cookies=[];
        for(var i=bookstores.length-1;i>=0;i--){
            cookies.push(await MypageModel.selectProfile(bookstores[i]));
        }
        var obj =[];
        cookies.forEach(e => obj.push(e[0]));
        console.log('obj : ', obj);
        
        console.log(req.cookies.Expires);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECENT_BOOKSTORES, obj.slice(0,10)));        
    },
    updateMyinfo: async(req, res)=>{
        if(req.decoded === undefined){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.REQUIRE_LOGIN));
        }else{
            try {
                const userIdx = req.decoded.userIdx;
                const result = await MypageModel.showMyinfo(userIdx);
                if(result.length==0){
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_PROFILE_FAIL));
                }else{
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS, result[0]));
                }
            } catch (err) {
                return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
        
    },
    updateProfile: async(req, res)=>{
        if(req.decoded === undefined){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.REQUIRE_LOGIN));
        }else{
            try{
                const userIdx = req.decoded.userIdx;
                const profile = req.file.location;
                if(profile === undefined){
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
                }
                const type = req.file.mimetype.split('/')[1];
                console.log('type : ', type);
                if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UNSUPPORTED_TYPE));
                }
                const result = await MypageModel.updateProfile(userIdx, profile);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_PROFILE_SUCCESS, result[0]));
            }catch(err){
                return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    updateNickname: async(req, res)=>{
        if(req.decoded === undefined){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.REQUIRE_LOGIN));
        }else{
            try{
                const userIdx = req.decoded.userIdx;
                const nickname = req.body.nickname;
                const result = await MypageModel.updateNickname(userIdx, nickname);
                if(result === 1){
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_PROFILE_SUCCESS, {
                        updatedNickname : nickname
                    }));
                }
            }catch(err){
                return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    sendAuthCode: async(req, res)=>{
        if(req.decoded === undefined){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.REQUIRE_LOGIN));
        }else{
            try{
                const userIdx = req.decoded.userIdx;
                const email=req.body.email;
                //데이터 누락
                if(!email){
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
                }
                const result = await MypageModel.checkUserByUserIdx(userIdx);
                if(result[0].email !== email){
                    //해당 이메일이 db에 없을 때
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NOT_MATCH_EMAIL));
                }else{
                    //해당 이메일이 db에 있을 때
                    const authCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
                    console.log(authCode);
                    let emailParam = {
                        toEmail : email,
                        subject : 'New Email From COZY',
                        text : `인증번호 : ${authCode}`
                    };
                    mailer.sendGmail(emailParam);
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEND_EMAIL_SUCCESS, {
                        authCode: authCode
                    }));
                }
            }catch(err){
                return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    updatePassword: async(req, res)=>{
        if(req.decoded === undefined){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.REQUIRE_LOGIN));
        }else{
            try{
                const userIdx = req.decoded.userIdx;
                const newPassword = req.body.password;
                const {
                    salt,
                    hashed
                } = await encrypt.encrypt(newPassword);
                const result = await MypageModel.updatePassword(userIdx, salt, hashed);
                if(result===1){
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_PASSWORD, result));
                }
            }catch(err){
                return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    }
}

module.exports = mypage;