const ActivityModel = require('../models/activityModel');
const encrypt = require('../modules/crypto');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const jwt = require('../modules/jwt');
const mailer = require('../modules/mailer');
const multer = require('../modules/multer');

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const activity = {
    showActivitiesByBookstore: async (req, res) => {
        // const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        try {
            const activitiesByBookstore = await ActivityModel.showActivitiesByBookstore(bookstoreIdx);
            if (activitiesByBookstore.length==0) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
            else{
                    for (var item in activitiesByBookstore) {
                        if ( activitiesByBookstore[item].dday > 300000) {
                            activitiesByBookstore[item].dday = null;
                        
                        }
                    }
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, activitiesByBookstore));
            }
        } catch (err) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    // 우선 임시로 여기에 넣음
    /**
     * category: 18개
     * 1. 영화 상영 2. 글쓰기 모임 3. 공간 대여 4. 독서 모임 5. 심야 책방  6. 전시, 공연
        7. 책 추천 8. 위크숍 9. 북토크 10. 음악 감상 11. 낭독 모임 12. 묵독 모임
        13. 필사 모임 14. 숙박 15. 만들기 16. 정기간행물 17. 강연 18. 마켓
     */
    registerActivity: async (req, res) => {
        const {bookstoreIdx, activityName, categoryIdx, categoryName, price, limitation, shortIntro, introduction, period, deadline, image} = req.body;

        try{
            if (!bookstoreIdx || !activityName || !categoryIdx || !price) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
            }
            const idx = await ActivityModel.registerActivity(bookstoreIdx, activityName, categoryIdx, categoryName, price, limitation, shortIntro, introduction, period, deadline, image);
            
            if(idx === -1){
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_INSERT_REVIEW));
            }else{
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.INSERT_REVIEW_SUCCESS, idx));
            }
        }catch(err){
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showActivitiesByLatest: async (req, res) => {
        const categoryIdx = req.params.categoryIdx;

        try {
            const activitiesByLatest = await ActivityModel.showActivitiesByLatest(categoryIdx);
            if (activitiesByLatest.length == 0) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
            else{
                for (var item in activitiesByLatest) {
                    if ( activitiesByLatest[item].dday > 300000) {
                        activitiesByLatest[item].dday = null;
                    }
                }
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, activitiesByLatest));
            }
        } catch (err) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showActivitiesByDeadline: async (req, res) => {
        const categoryIdx = req.params.categoryIdx;

        try {
            const activitiesByDeadline = await ActivityModel.showActivitiesByDeadline(categoryIdx);
            if (!activitiesByDeadline.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
            else {
                for (var item in activitiesByDeadline) {
                    if ( activitiesByDeadline[item].dday > 300000) {
                        activitiesByDeadline[item].dday = null;
                    }
                }
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, activitiesByDeadline));
            }
        } catch (err) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showActivityDetail: async (req, res)=>{
        // const activityName = decodeURI(req.params.activityName);
        const activityIdx = req.params.activityIdx;
        try{
            const result = await ActivityModel.showActivityDetail(activityIdx);
            
            if( result.length > 0 ){
                if ( result[0].dday > 300000) {
                    result[0].dday = null;
                }
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, result));
            }else{
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
        }catch(err){
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}

module.exports = activity;