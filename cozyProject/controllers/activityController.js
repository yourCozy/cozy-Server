const ActivityModel = require('../models/activityModel');
const encrypt = require('../modules/crypto');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const jwt = require('../modules/jwt');
const mailer = require('../modules/mailer');
const multer = require('../modules/multer');

const activity = {
    showRecommendation: async (req, res) => {
        
    },
    showActivitiesByBookstore: async (req, res) => {
        // const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        
        try {
            const activitiesByBookstore = await ActivityModel.showActivitiesByBookstore(bookstoreIdx);
            if (!activitiesByBookstore.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, activitiesByBookstore));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
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
        const {bookstoreIdx, activityName, categoryIdx, price, limitation, intro, accountNum, deadline} = req.body;

        try{
            if (!bookstoreIdx || !activityName || !categoryIdx || !price || !limitation) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
            }
            const idx = await ActivityModel.registerActivity(bookstoreIdx, activityName, categoryIdx, price, limitation, intro, accountNum, deadline);
            
            if(idx === -1){
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_INSERT_REVIEW));
            }else{
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.INSERT_REVIEW_SUCCESS, idx));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showActivitiesByLatest: async (req, res) => {
        const categoryIdx = req.params.categoryIdx;

        try {
            const activitiesByLatest = await ActivityModel.showActivitiesByLatest(categoryIdx);
            if (!activitiesByLatest.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, activitiesByLatest));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showActivitiesByDeadline: async (req, res) => {
        const categoryIdx = req.params.categoryIdx;

        try {
            const activitiesByDeadline = await ActivityModel.showActivitiesByDeadline(categoryIdx);
            if (!activitiesByDeadline.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, activitiesByDeadline));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}

module.exports = activity;