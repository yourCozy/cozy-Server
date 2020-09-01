const MypageModel = require('../models/mypageModel');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const e = require('express');

const mypage = {
    registerTastes: async (req, res) => {
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
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_TASTES_SUCCESS, result));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        // 온보딩에서 취향 선택을 할 시에는 해시태그+문화활동 합쳐서 받음. 제일 처음에 뜨는 추천 탭에는 사용자의 취향선택과 가장많이 중복되는 책방부터 출력.

    },
    updateTastes: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        var opt = Object.values(req.query); // json 객체의 value 값들을 배열로 반환
        // console.log(opt);

        try {
            const result = await MypageModel.updateTastes(userIdx, opt);
            
            // const tastes = result[0].tastes;
            // const bookstores = await MypageModel.orderByTastes(userIdx, tastes);
            // console.log(bookstores);

            if (!result.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UPDATE_TASTES_FAIL));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_TASTES_SUCCESS, result));
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
            const interest = await MainModel.showInterest(userIdx);
            console.log('interest: ', interest);
            if(interest.length === 0){
                const nickname = await MainModel.selectNickname(userIdx);
                console.log('nickname: ', nickname);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_DATA, [{
                    bookstoreIdx: 0,
                    bookstoreName: "NULL",
                    profile: "NULL",
                    hashtag1: "NULL",
                    hashtag2: "NULL",
                    hashtag3: "NULL",
                    nickname: nickname[0].nickname,
                    image1: "NULL"
                }]));
            }else{
                console.log(interest);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, interest));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    updateBookmark: async (req, res) => {
        const bookstoreIdx = req.params.bookstoreIdx;
        const userIdx = req.decoded.userIdx;
        try {
            const result = await MainModel.updateBookmark(userIdx, bookstoreIdx);
            let message = '북마크 체크';
            if(result === 0){
                message = '북마크 해제';
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOKMARK_SUCCESS, {checked: result}));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showRecent : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        var bookstores = req.cookies.bookstores;
        if (!req.cookies.bookstores) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_RECENT_BOOKSTORES));
        }

        console.log(bookstores);
        
        // json 객체 담을 배열
        var cookies=[];
        for(var i=bookstores.length-1;i>=0;i--){
            cookies.push(await MainModel.selectProfile(bookstores[i]));
        }
        var obj =[];
        cookies.forEach(e => obj.push(e[0]));
        console.log('obj : ', obj)
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECENT_BOOKSTORES, obj));
        
    },
}

module.exports = mypage;