const BookstoreModel = require('../models/bookstoreModel');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const pool = require('../modules/pool');
const { async } = require('../models/bookstoreModel');
const { text } = require('express');

const bookstore = {
    showRecommendation : async (req, res) => {
        // 로그인 하지 않은 사용자를 위한 추천뷰, 토큰 인증 필요없음.
        console.log(req.decoded);

        if (req.decoded === undefined) {
            const bookstoreForAny = await BookstoreModel.showRecommendation();
            try {
                if (!bookstoreForAny.length) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
                }
                else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstoreForAny));
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        } else {
            const userIdx = req.decoded.userIdx;
            console.log(userIdx);

            console.log('userIdx: ',userIdx);
            // var autoLogin = req.cookies.autoLogin;
            //var userIdx=req.session.userIdx;
            const tastesResult = await BookstoreModel.showTastes(userIdx);
            if (!tastesResult.length) {
                const withoutTasteQuery = await BookstoreModel.showRecommendationByUser(userIdx);
                try {
                    if (!withoutTasteQuery.length) {
                        return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
                    }
                    else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, withoutTasteQuery));
                } catch (err) {
                    res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
                }
            } else {
                const tastes = tastesResult[0].tastes;
                const countZeroResult = await BookstoreModel.updateTasteCountToZero();
                console.log(countZeroResult);
                const bookstore = await BookstoreModel.orderByTastes(userIdx, tastes);
                try {
                    if (!bookstore.length) {
                        return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
                    }
                    else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstore));
                } catch (err) {
                    res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
                }
            }
        }        
    },
    showDetail : async (req, res) => {
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
        if (result.length == 0){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
        }
        //console.log('bb: ', bookstores);
        //console.log('result[0].bookstoreIdx: ', result[0].bookstoreIdx);
        
        // 서점 리스트가 정상적으로 있다면
        // if (result[0].bookstoreIdx !== undefined) {
        //     if(bookstores.indexOf(result[0].bookstoreIdx) === -1){
        //         bookstores.push(result[0].bookstoreIdx);
        //     }else{
        //         bookstores.splice(bookstores.indexOf(result[0].bookstoreIdx),1);
        //         bookstores.push(result[0].bookstoreIdx);
        //     }
        // }
        // console.log('result[0].bookstoreIdx: ', result[0].bookstoreIdx);
        // if (result[0].bookstoreIdx === undefined) {
        //     return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
        // }
        else{
            if(bookstores.indexOf(result[0].bookstoreIdx) === -1){
                bookstores.push(result[0].bookstoreIdx);
            }else{
                bookstores.splice(bookstores.indexOf(result[0].bookstoreIdx),1);
                bookstores.push(result[0].bookstoreIdx);
            }
        console.log('result[0] : ',result[0].bookstoreIdx);
        console.log('bookstores <cookies> : ',bookstores);
        res.cookie('bookstores', bookstores, {
            maxAge: 60*60*1000*24
        });
        console.log('req.cookies.bookstores: ',req.cookies.bookstores);
        console.log('req.cookies: ',req.cookies);
        console.log('startTime: ', req._startTime);

        if (req.decoded === undefined) {
            // console.log(req.decoded);
            const bookstoreForAny = await BookstoreModel.showDetailForAny(bookstoreIdx);
            try {
                if (bookstoreForAny.length === 0) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
                }
                else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstoreForAny));
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        } else {
            const userIdx = req.decoded.userIdx;
            
            const bookstore = await BookstoreModel.showDetail(userIdx, bookstoreIdx);
            try {
                if (bookstore.length === 0) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
                }
                else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstore));
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    }
        
    },
    showBookstoreFeed: async (req, res) => {
        const bookstoreIdx = req.params.bookstoreIdx;

        try {
            const result = await BookstoreModel.showBookstoreFeed(bookstoreIdx);
            var i=1;
            var list=new Array();
            var Json=new Object();
            for(key in result[0]){
                if(i==3){
                    i=1;
                    if(Json.image!==null || Json.text!==null){
                        list.push(Json)
                    }
                    Json=new Object();
                }
                if(result[0][key]!==null && result[0][key]!=="" && i==1){
                    Json.image=result[0][key];
                }
                if((result[0][key]===null || result[0][key]==="") && i==1){
                    Json.image=null;
                }
                if(result[0][key]!==null && result[0][key]!=="" && i==2){
                    Json.text=result[0][key];
                }
                if((result[0][key]===null || result[0][key]==="") && i==2){
                    Json.text=null;
                }
                i+=1;
            }
            if(Json.image!==null || Json.text!==null){
                list.push(Json)
            }
            if (!result.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.GET_BOOKSTORE_FAIL));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, `${bookstoreIdx}번 ` + resMessage.GET_BOOKSTORE_SUCCESS, list));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showBookstoreNumber : async (req, res) => {
        // const sectionIdx = req.params.sectionIdx;    
        //sectionIdx 넘겨주는데 꼭 필요한가..

        const sections = [{sectionIdx: 1}, {sectionIdx: 2}, {sectionIdx: 3}, {sectionIdx: 4}, {sectionIdx: 5}, {sectionIdx: 6}];

        try {
            const numberOfBookstores = await BookstoreModel.showBookstoreNumber();

            if (numberOfBookstores.length < 6) {
                for (var a in sections) {
                    for (var b in numberOfBookstores) {
                        if (sections[a].sectionIdx === numberOfBookstores[b].sectionIdx) {
                            sections[a].count = numberOfBookstores[b].count;
                            break;
                        }
                        else {
                            sections[a].count = 0;
                        }
                    }
                }
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_SECTION, sections));
            }
            else {
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_SECTION, numberOfBookstores));
            }
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showBookstoresBySection : async (req, res) => {
        const sectionIdx = req.params.sectionIdx;

        if (req.decoded === undefined) {
            try {
                const bookstoreBySectionForAny = await BookstoreModel.showBookstoresBySectionForAny(sectionIdx);
                if (!bookstoreBySectionForAny.length) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
                }
                else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstoreBySectionForAny));
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        } else {
            const userIdx = req.decoded.userIdx;
            try {
                const bookstoreBySection = await BookstoreModel.showBookstoresBySection(userIdx, sectionIdx);
                if (!bookstoreBySection.length) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
                }
                else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstoreBySection));
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    searchByKeyword : async (req, res) => {
        // const userIdx = req.decoded.userIdx;
        const keyword = decodeURI(req.params.keyword);
        console.log('search keyword : ', keyword);

        if (req.decoded === undefined) {
            try {
                const result = await BookstoreModel.searchByKeywordForAny(keyword);
                if (!result.length) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_SEARCH_DATA));
                } else {
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, `'${keyword}' ` + resMessage.SUCCESS_SEARCH, result));
                }
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        } else {
            const userIdx = req.decoded.userIdx;
            try {
                const result = await BookstoreModel.searchByKeyword(userIdx, keyword);
                if (!result.length) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_SEARCH_DATA));
                } else {
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, `'${keyword}'` + resMessage.SUCCESS_SEARCH, result));
                }
            } catch (err) {
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
        
    }
}

module.exports = bookstore;