const BookstoreModel = require('../models/bookstoreModel');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');

const bookstore = {
    orderByTastes: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const tastesResult = await BookstoreModel.showTastes(userIdx);
        const tastes = tastesResult[0].tastes;
        const countZeroResult = await BookstoreModel.updateTasteCountToZero();
        console.log(countZeroResult);
        const result = await BookstoreModel.orderByTastes(userIdx, tastes);
        try {
            if (!result.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, result));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showRecommendation : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        // var autoLogin = req.cookies.autoLogin;
        //var userIdx=req.session.userIdx;
        const bookstore = await BookstoreModel.showRecommendation(userIdx);
        try {
            if (!bookstore.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstore));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showDetail : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;

        /**
         * 🔥 cookie 🔥
         * 현재 사용자가 가지고 있는 쿠키 확인: req.cookies.[cookie_name]
         * 쿠기 저장: res.cookie('cookie_name', 'cookie_value', option)
         * [option] 👇
         * maxAge: 쿠키의 만료 시간을 밀리초 단위로 설정
         * expires: 쿠키의 만료 시간을 표준 시간 으로 설정
         * path: 쿠키의 경로 (default: /)
         * domain: 쿠키의 도메인 이름 (default: loaded)
         * secure: HTTPS 프로토콜만 쿠키 사용 가능
         * httpOnly: HTTP 프로토콜만 쿠키 사용 가능
         * signed: 쿠키의 서명 여부를 결정
         *  */ 
        var bookstores=req.cookies.bookstores;
        // 쿠키 확인
        if (req.cookies.bookstores) { // 이미 쿠키값이 있다면
            bookstores = req.cookies.bookstores; // 배열 형식으로?
        } else { // 최초 실행 시
            bookstores = [];
        }
        // parseInt(bookstoreIdx): integer 타입으로 형변환
        const result = await BookstoreModel.checkBookStore(bookstoreIdx);
        //console.log('bb: ', bookstores);
        //console.log('result[0].bookstoreIdx: ', result[0].bookstoreIdx);
        
        // 서점 리스트가 정상적으로 있다면
        if (result[0].bookstoreIdx !== undefined) {
            if(bookstores.indexOf(result[0].bookstoreIdx) === -1){
                bookstores.push(result[0].bookstoreIdx);
            }else{
                bookstores.splice(bookstores.indexOf(result[0].bookstoreIdx),1);
                bookstores.push(result[0].bookstoreIdx);
            }
        }
        
        console.log('result[0] : ',result[0].bookstoreIdx);
        console.log('bookstores <cookies> : ',bookstores);
        res.cookie('bookstores', bookstores, {
            maxAge: 60*60*1000*24
        });
        const bookstore = await BookstoreModel.showDetail(userIdx, bookstoreIdx);
        try {
            if (bookstore.length === 0) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstore));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showBookstoresBySection : async (req, res) => {
        const sectionIdx = req.params.sectionIdx;
        const userIdx = req.decoded.userIdx;
        console.log('sectionIdx: ',sectionIdx);
        try {
            const bookstoreBySection = await BookstoreModel.showBookstoresBySection(userIdx, sectionIdx);
            if (!bookstoreBySection.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstoreBySection));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    searchByKeyword : async (req, res) => {
        // const userIdx = req.decoded.userIdx;
        const keyword = decodeURI(req.params.keyword);
        console.log('search keyword : ', keyword);

        // isConsonant: 주어진 문자가 자음인지 판단
        // if (hangul.isConsonantAll(keyword)) {
        //     console.log('한글로만 이루어져 있습니다!');
        // }

        // if (keyword === null) {
        //     return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_KEYWORD));
        // }

        try {
            const result = await BookstoreModel.searchByKeyword(keyword);
            if (!result.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_SEARCH_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_SEARCH, result));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}

module.exports = bookstore;